const ServerCodes = {
  CommomCode: {
    Success: 0,
    Error: 1,
    NotFound: 2,
    MissingRequiredFields: 3,
    FieldValidationFailed: 4,
    InvalidQueryOperator: 5,
    InternalServerError: 6,
    InvalidUUID: 7,
    BadRequest: 8,
    QueryFailed: 9,
  },
  AuthCode: {
    PaswordIsIncorrect: 100,
    InvalidCredentials: 101,
    UserNotFound: 102,
    EmailAlreadyExsist: 103,
    PasswordIsInvalid: 104,
    UserNotActive: 104,
    UserNotUpdateProfile: 105,
    EmailOrPasswordIsIncorrect: 106,
    OTPCodeIsIncorrectOrExpired: 107,
    UserIsAlreadyActive: 108,
    UserHasBeenBaned: 109,
    UserIsNotBaned: 110,
    TokenIsExpired: 111,
    TokenIsInvalid: 112,
    TokenIsMissing: 113,
    UserIsNotVerified: 114,
    AccessTokenIsRequired: 115,
  },
  PostCode: {
    PostNotUpdate: 202,
    PostIsAlreadyApproved: 203,
  },
  UserCode: {
    UserNotUpdate: 302,
  },
  AdminCode: {
    MissingRequiredFields: 402,
    PostAlreadyApproved: 403,
  },
  LoanRequestCode: {
    CancleFailed: 500,
    PaymentFailed: 501,
    RejectFailed: 502,
    AcceptFailed: 503,
  },
  ReportCode: {
    AlReadyReported: 600,
    ReportIsAlreadyHandled: 601,
  },
  BankCode: {
    AddBankAccountFailed: 700,
  },
  ConversationCode: {
    ConversationNotFound: 800,
    CanNotCreateWithYourSelf: 801,
  },
};
export default ServerCodes;
