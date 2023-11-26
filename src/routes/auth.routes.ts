import { Router } from 'express';
import AuthController from '~/controllers/auth.controller';
import AuthValidation  from '~/middlewares/auth.middleware';
import DependencyInjection  from '~/di/di';
const router = Router();
const authValidation = DependencyInjection.get<AuthValidation>(AuthValidation);
const authController = DependencyInjection.get<AuthController>(AuthController);
router.route('/sign-up').post(authValidation.signUpValidation, authController.signUp);
router.route('/active-account').get(authValidation.acctiveAccountValidation, authController.activeAccount);
router.route('/resend-activation-code').post(authValidation.resendActivationCodeValidation, authController.resendActivationCode);
router.route('/sign-in').post(authValidation.signInValidation, authController.signIn);
router.route('/refresh-token').get(authValidation.refreshTokenValidation, authController.refreshToken);
router.route('/change-password').post(authValidation.accessTokenValidation, authController.changePassword);
router.route('/forgot-password').post(authValidation.forgotPasswordValidation, authController.forgotPassword);
router
  .route('/verify-forgot-password-otp')
  .get(authValidation.verifyRecoveryTokenValidation, authController.verifyRecoveryPasswordOTP);
router.route('/reset-password').post(authValidation.resetPasswordValidation, authController.resetPassword);
router.route('/sign-out').post(authValidation.accessTokenValidation, authController.signOut);
router.route('/sign-out-all').post(authValidation.accessTokenValidation, authController.signOutAll);

export default router;
