// types.ts
export enum LoanContractStatus {
  Approved,
  Rejected,
  Pending,
  Active,
  Closed,
}

export interface LoanContract {
  loanId: string;
  status: LoanContractStatus;
  borrowerId: string;
  lenderId: string;
  borrower: string;
  lender: string;
  lenderBankCardNo: string;
  borrowerBankCardNo: string;
  loanReason: string;
  amount: number;
  interest: number;
  overdueInterest: number;
  tenureInMonths: number;
  startDate: number;
}

// dtos.ts
export interface CreateLoanContractDTO {
  loanId: string;
  borrowerId: string;
  lenderId: string;
  borrwer: string;
  lender: string;
  lenderBankCardNo: string;
  borrowerBankCardNo: string;
  amount: number;
  interest: number;
  overdueInterest: number;
  tenureInMonths: number;
  startDate: number;
}

export interface IBlockchainService {
  addLoanContract(createLoanContractDTO: CreateLoanContractDTO): Promise<any>;
  approveLoanContract(loanId: string): Promise<any>;
  rejectLoanContract(loanId: string): Promise<any>;
  activateLoanContract(loanId: string): Promise<any>;
  getLoanContractById(loanId: string): Promise<any>;
  getAllLoanContracts(): Promise<any>;
}
