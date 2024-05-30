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

  public static readonly zalopayAPI = 'ZALOPAY_API';
  public static readonly zalopaySandboxPrivateKey =
    'ZALOPAY_SANDBOX_PRIVATE_KEY';
  public static readonly zalopaySandboxAppId = 'ZALOPAY_SANDBOX_APP_ID';
  public static readonly zalopaySandboxKey1 = 'ZALOPAY_SANDBOX_KEY1';
  public static readonly zalopaySandboxKey2 = 'ZALOPAY_SANDBOX_KEY2';
}

export { EnvConstants };
