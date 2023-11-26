import { LoanContractRequestStatus, LoanContractRequestTypes, LoanReasonTypes } from "~/constants/enum";

interface LoanRequestCreateData {
  sender_id: string;
  receiver_id: string;
  loan_amount: number;
  interest_rate: number;
  overdue_interest_rate: number;
  loan_tenure_months: number;
  loan_reason_type: string;
  loan_reason: string;
  video_comfirmation: string;
  portait_photo: string;
  id_card_front_photo: string;
  id_card_back_photo: string;
  sender_bank_account_id: string;

  }
  export default LoanRequestCreateData;