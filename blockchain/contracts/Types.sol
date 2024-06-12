// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

library Types {
    enum LoanContractStatus {
        Approved,
        Rejected,
        Pending,
        Active
    }

    struct LoanContract {
        string loanId;
        LoanContractStatus status;
        string borrowerId;
        string lenderId;
        address borrower;
        address lender;
        string lenderBankCardNo;
        string borrowerBankCardNo;
        uint256 amount;
        uint256 interest;
        uint256 overdueInterest;
        uint256 tenureInMonths;
        uint256 startDate;
    }
}
