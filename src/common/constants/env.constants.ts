abstract class EnvConstants {
  public static readonly env = 'ENV';
  public static readonly isProduction = 'IS_PRODUCTION';
  public static readonly isDevelopment = 'IS_DEVELOPMENT';
  public static readonly port = 'PORT';
  public static readonly databaseUrl = 'DATABASE_URL';
  public static readonly accessTokenSecret = 'ACCESS_TOKEN_SECRET';
  public static readonly refreshTokenSecret = 'REFRESH_TOKEN_SECRET';
  public static readonly accessTokenLife = 'ACCESS_TOKEN_LIFE';
  public static readonly refreshTokenLife = 'REFRESH_TOKEN_LIFE';
  public static readonly verifyEmailSecret = 'VERIFY_EMAIL_SECRET';
  public static readonly passwordSecret = 'PASSWORD_SECRET';
}

export { EnvConstants };
