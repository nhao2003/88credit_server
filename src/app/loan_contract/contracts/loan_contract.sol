// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.25;

contract LoanContract {
    string public borrower;
    string public lender;
    uint public amount;
    uint public interest;
    uint public duration;
    uint public startDate;
    uint public endDate;
    uint public status;
}
