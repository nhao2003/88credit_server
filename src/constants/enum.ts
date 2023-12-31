export enum UserStatus {
  unverified = 'unverified',
  not_update = 'not_update',
  banned = 'banned',
  deleted = 'deleted',
  verified = 'verified',
}

export enum Role {
  admin = 'admin',
  staff = 'staff',
  user = 'user',
}

export enum OTPTypes {
  account_activation = 'account_activation',
  password_recovery = 'password_recovery',
}

export enum MessageTypes {
  text = 'text',
  media = 'media',
  location = 'location',
  post = 'post',
}
export enum LoanReasonTypes {
  business = 'business',
  education = 'education',
  travel = 'travel',
  wedding = 'wedding',
  medical = 'medical',
  shopping = 'shopping',
  houseBuying = 'house-buying',
  carBuying = 'car-buying',
  other = 'other',
}

export enum PostTypes {
  lending = 'lending',
  borrowing = 'borrowing',
}
export enum LoanContractRequestTypes {
  lending = 'lending',
  borrowing = 'borrowing',
}

export enum LoanContractRequestStatus {
  cancle = 'cancle',
  pending = 'pending',
  rejected = 'rejected',
  waiting_for_payment = 'waiting_for_payment',
  paid = 'paid',
}

export enum TransactionStatus {
  pending = 'pending',
  success = 'success',
  failed = 'failed',
}

export enum PaymentMethods {
  zalo_pay = 'zalo_pay',
}

export enum PostStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  hided = 'hided',
}

export enum ReportStatus {
  pending = 'pending',
  resolved = 'resolved',
  rejected = 'rejected',
}

export enum ReportType {
  user = 'user',
  post = 'post',
  conversation = 'conversation',
}

export enum ReportContentType {
  spam = 'spam',
  offensive = 'offensive',
  inappropriate = 'inappropriate',
  copyrighted = 'copyrighted',
  misleading = 'misleading',
  illegal = 'illegal',
  adult_content = 'adult_content',
  hate_speech = 'hate_speech',
  bullying = 'bullying',
  violence = 'violence',
  fake_news = 'fake_news',
  fraud = 'fraud',
  impersonation = 'impersonation',
  privacy_violation = 'privacy_violation',
  harassment = 'harassment',
  discrimination = 'discrimination',
  political_bias = 'political_bias',
  other = 'other',
}
