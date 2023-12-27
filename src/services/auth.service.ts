// import RefreshToken from "~/models/database/RefreshToken";
import { DataSource, FindOneOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { AppDataSource } from '~/app/database';
import { OTPTypes, UserStatus } from '~/constants/enum';
import { OTP } from '~/models/databases/Otp';
import { Session } from '~/models/databases/Sesstion';
import { User } from '~/models/databases/User';
import { hashPassword, hashString } from '~/utils/crypto';
import { UserPayload, signToken, verifyToken } from '~/utils/jwt';
import { parseTimeToMilliseconds } from '~/utils/time';
import AppConfig from '~/constants/configs';
import { Service } from 'typedi';
import { APP_MESSAGES } from '~/constants/message';
import { AppError } from '~/models/Error';
import ServerCodes from '~/constants/server_codes';
import HttpStatus from '~/constants/httpStatus';
type SignInResult = {
  access_token: string;
  refresh_token: string;
  session_id: string;
};

@Service()
class AuthServices {
  private userRepository: Repository<User>;
  private otpRepository: Repository<OTP>;
  private sessionRepository: Repository<Session>;
  constructor(dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
    this.otpRepository = dataSource.getRepository(OTP);
    this.sessionRepository = dataSource.getRepository(Session);
  }

  public async verifyOtpCode(email: string, otp_code: string, type: OTPTypes): Promise<boolean> {
    const user = await this.checkUserExistByEmail(email);
    if (user === null || user === undefined) {
      throw new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.USER_NOT_FOUND, {
        serverCode: ServerCodes.AuthCode.UserNotFound,
      });
    }
    const verifyOTPCodes = await this.getOTP(user.id, otp_code, type);
    if (verifyOTPCodes === null) {
      return false;
    }
    return true;
  }

  public async resetPassword(
    email: string,
    password: string,
    otp_code: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.checkUserExistByEmail(email);
    if (user === null || user === undefined) {
      throw new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.USER_NOT_FOUND, {
        serverCode: ServerCodes.AuthCode.UserNotFound,
      });
    }
    const verifyOTPCodes = await this.verifyOTPCodeAndUse(user.id, otp_code, OTPTypes.password_recovery);
    if (verifyOTPCodes === false) {
      throw new AppError(HttpStatus.BAD_REQUEST, APP_MESSAGES.OTPCodeIsIncorrectOrExpired, {
        serverCode: ServerCodes.AuthCode.OTPCodeIsIncorrectOrExpired,
      });
    }
    await this.changePassword(user.id, password);
    await this.signOutAll(user.id);
    const { access_token, refresh_token } = await this.createSession(user.id);
    return { access_token, refresh_token };
  }

  private generateAccessToken(user_id: string, session_id: string): Promise<string> {
    return signToken({
      payload: { user_id, session_id },
      expiresIn: process.env.JWT_TOKEN_EXPIRES_IN as string,
    });
  }

  private async generateRefreshToken(user_id: string, session_id: string): Promise<string> {
    return await signToken({
      payload: { user_id, session_id },
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
    });
  }

  public async generateOTPCode(
    type: string,
    user_id: string,
    expiration_time: string = process.env.OTP_EXPIRES_IN as string,
  ): Promise<string> {
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = hashString((otp_code + process.env.OTP_SECRET_KEY + type) as string);
    // Save OTP code to database
    await this.otpRepository.insert({
      type,
      user_id,
      token,
      expiration_time: new Date(Date.now() + parseTimeToMilliseconds(expiration_time)),
    });
    return otp_code;
  }

  public async signUp(email: string, password: string): Promise<string> {
    const user = await this.userRepository.insert({ email, password: hashPassword(password) });
    const user_id = user.identifiers[0].id;
    const otp_code = await this.generateOTPCode(OTPTypes.account_activation, user_id);
    return otp_code;
  }

  // Resend OTP code if OPT code is expired
  public async resendOTPCode(email: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user === null) return null;
    if (user.status !== UserStatus.unverified) {
      throw new Error(APP_MESSAGES.UserIsAlreadyActive);
    }
    const otp_code = await this.generateOTPCode(OTPTypes.account_activation, user.id);
    return otp_code;
  }

  public async createSession(user_id: string): Promise<SignInResult> {
    const session = await this.sessionRepository.insert({
      user_id,
      expiration_date: new Date(
        Date.now() + parseTimeToMilliseconds(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string),
      ),
    });
    const refresh_token = await this.generateRefreshToken(user_id, session.identifiers[0].id);
    const access_token = await this.generateAccessToken(user_id, session.identifiers[0].id);
    return { access_token, refresh_token, session_id: session.identifiers[0].id };
  }

  public async signIn(email: string, password: string): Promise<SignInResult | null | undefined> {
    // const user = await this.userRepository.findOne({ where: { email, password: hashPassword(password) } });
    const { user, password_is_correct } = await this.getUserByEmailAndPassword(email, password);
    if (password_is_correct === false) {
      return null;
    }
    return await this.createSession(user!.id);
  }

  public async grantNewAccessToken(refresh_token: string): Promise<string | null | undefined> {
    const { payload, expired } = await verifyToken(refresh_token);
    if (expired) return null;
    const { user_id, session_id } = payload as UserPayload;
    const session = await this.sessionRepository.findOne({
      where: { id: session_id, user_id, expiration_date: MoreThanOrEqual(new Date()) },
    });
    if (session === null || session === undefined) return session;
    session.updated_at = new Date();
    await this.sessionRepository.save(session);
    return this.generateAccessToken(user_id, session_id);
  }

  public async getOTP(user_id: string, otp_code: string, type: string): Promise<OTP | null> {
    const token = hashString((otp_code + process.env.OTP_SECRET_KEY + type) as string);
    const otp = await this.otpRepository.findOne({
      where: {
        user_id,
        token,
        type,
        expiration_time: MoreThanOrEqual(new Date()),
        is_used: false,
      },
    });
    return otp;
  }

  public async verifyOTPCodeAndUse(user_id: string, otp_code: string, type: string): Promise<boolean> {
    const otp = await this.getOTP(user_id, otp_code, type);
    if (otp === null) {
      return false;
    }
    otp.is_used = true;
    await this.otpRepository.save(otp);
    return true;
  }

  /// Return true if account is active successfully else return false
  public async activeAccount(
    email: string,
    password: string,
    code: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const { user } = await this.getUserByEmailAndPassword(email, password);
    if (user === null || user === undefined) {
      throw new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD, {
        serverCode: ServerCodes.AuthCode.UserNotFound,
      });
    }
    const verifyOTPCodes = await this.verifyOTPCodeAndUse(user.id, code, OTPTypes.account_activation);
    if (verifyOTPCodes === false) {
      throw new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.OTPCodeIsIncorrectOrExpired, {
        serverCode: ServerCodes.AuthCode.OTPCodeIsIncorrectOrExpired,
      });
    }
    if (user.status !== UserStatus.unverified) {
      throw new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.UserIsAlreadyActive, {
        serverCode: ServerCodes.AuthCode.UserIsAlreadyActive,
      });
    }
    user.status = UserStatus.not_update;
    await this.userRepository.save(user);
    const { access_token, refresh_token } = await this.createSession(user.id);
    return { access_token, refresh_token };
  }

  async checkUserExistByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
  async checkUserExistByID(id: string): Promise<User | null> {
    // const user = await this.userRepository.createQueryBuilder().where('id = :id', { id }).select('password').getOne();
    const user = await this.userRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .addSelect('User.password')
      .getOne();
    return user;
  }

  //Get user by email and password
  async getUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<{
    user: User | null;
    password_is_correct: boolean;
  }> {
    const user = await this.userRepository
      .createQueryBuilder()
      .addSelect('User.password')
      .where('email = :email', { email })
      .getOne();
    if (user === null) {
      return { user, password_is_correct: false };
    }
    const password_is_correct = hashPassword(password) === user.password;
    return { user, password_is_correct };
  }

  async signOut(session_id: string) {
    const session = await this.sessionRepository.findOne({ where: { id: session_id } });
    if (session) {
      await this.sessionRepository.delete({ id: session.id });
    }
  }
  async signOutAll(user_id: string) {
    await this.sessionRepository.delete({ user_id });
  }

  async checkSessionExist(session_id: string): Promise<Session | null> {
    const session = await this.sessionRepository.findOne({
      where: { id: session_id, expiration_date: MoreThanOrEqual(new Date()) },
    });
    return session;
  }

  private async findUserOrThrow(option: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(option);
    if (user === null) {
      throw new AppError(HttpStatus.NOT_FOUND, APP_MESSAGES.USER_NOT_FOUND, {
        serverCode: ServerCodes.AuthCode.UserNotFound,
      });
    }
    return user;
  }

  async changePassword(user_id: string, password: string): Promise<void> {
    const user = await this.findUserOrThrow({
      where: { id: user_id },
    });
    user.password = hashPassword(password);
    await this.userRepository.save(user);
  }
  async forgotPassword(email: string): Promise<string> {
    const user = await this.findUserOrThrow({
      where: { email },
    });
    const otp_code = await this.generateOTPCode(OTPTypes.password_recovery, user.id);
    return otp_code;
  }

  async generateResetPasswordToken(id: string, session_id: string): Promise<string | null> {
    const reset_password_token = await signToken({
      payload: { id, session_id },
      expiresIn: AppConfig.RECOVERY_PASSWORD_EXPIRES_IN,
      secretKey: AppConfig.RECOVERY_PASSWORD_SERECT_KEY,
    });
    return reset_password_token;
  }
}

export default AuthServices;
