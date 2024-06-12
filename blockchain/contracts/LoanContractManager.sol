// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;
import "./Types.sol"; 

contract LoanContractManager {

    mapping(string => Types.LoanContract) internal loanContracts;
    string[] private loanIds;

    address private owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyLender(string memory loanId) {
        require(
            msg.sender == loanContracts[loanId].lender,
            "Only lender can call this function"
        );
        _;
    }

    event LoanContractAdded(string loanId);
    event LoanContractApproved(string loanId);
    event LoanContractRejected(string loanId);
    event LoanContractActivated(string loanId);

    constructor() {
        owner = msg.sender;
    }

    function addLoanContract(
Types.LoanContract memory newLoanContract
    ) public onlyOwner {
        string memory loanId = newLoanContract.loanId;
        require(
            !loanContractExists(loanId),
            "Loan contract with the same ID already exists"
        );
        loanContracts[loanId] = newLoanContract;
        loanIds.push(loanId);
        emit LoanContractAdded(loanId);
    }

    function approveLoanContract(
        string memory loanId
    ) public onlyLender(loanId) {
        require(
            loanContracts[loanId].status == Types.LoanContractStatus.Pending,
            "Loan contract must be in pending status to be approved"
        );
        loanContracts[loanId].status = Types.LoanContractStatus.Approved;
        emit LoanContractApproved(loanId);
    }

    function rejectLoanContract(
        string memory loanId
    ) public onlyLender(loanId) {
        require(
            loanContracts[loanId].status == Types.LoanContractStatus.Pending,
            "Loan contract must be in pending status to be rejected"
        );
        loanContracts[loanId].status = Types.LoanContractStatus.Rejected;
        emit LoanContractRejected(loanId);
    }

    function activateLoanContract(string memory loanId) public onlyOwner {
        require(
            loanContracts[loanId].status == Types.LoanContractStatus.Approved,
            "Loan contract must be approved to be activated"
        );
        loanContracts[loanId].status = Types.LoanContractStatus.Active;
        emit LoanContractActivated(loanId);
    }

    function loanContractExists(
        string memory loanId
    ) public view returns (bool) {
        if (keccak256(abi.encodePacked(loanContracts[loanId].loanId)) == keccak256(abi.encodePacked(loanId))) {
            return true;
        } else {
            return false;
        }
    }

    function getLoanContractById(
        string memory loanId
    ) public view returns (Types.LoanContract memory) {
        require(bytes(loanId).length > 0, "Loan ID is required");
        require(loanContractExists(loanId), "Loan contract does not exist");

        return loanContracts[loanId];
    }

    function getAllLoanContracts() public view returns (Types.LoanContract[] memory) {
        Types.LoanContract[] memory allContracts = new Types.LoanContract[](loanIds.length);
        for (uint i = 0; i < loanIds.length; i++) {
            allContracts[i] = loanContracts[loanIds[i]];
        }
        return allContracts;
    }
}
