// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public pin;
    uint256 public loanAmount;
    uint256 public loanTerm; // in months
    uint256 public monthlyRepayment;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event PinChanged(uint256 newPin);
    event LoanRequested(uint256 loanAmount, uint256 loanTerm, uint256 monthlyRepayment);

    constructor(uint256 initBalance, uint256 _pin) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        pin = _pin;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert
                InsufficientBalance({
                    balance: balance,
                    withdrawAmount: _withdrawAmount
                });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function changePin(uint256 _newPin) public {
        require(msg.sender == owner, "You are not the owner of this account");
        pin = _newPin;

        // emit the event
        emit PinChanged(_newPin);
    }

    function getPin() public view returns (uint256) {
        require(msg.sender == owner, "You are not the owner of this account");
        return pin;
    }

    function requestLoan(uint256 _requestedLoanAmount, uint256 _loanTermInMonths) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(_requestedLoanAmount > 0, "Loan amount must be greater than 0");
        require(_loanTermInMonths > 0, "Loan term must be greater than 0");

        loanAmount = _requestedLoanAmount;
        loanTerm = _loanTermInMonths;
        monthlyRepayment = (_requestedLoanAmount / _loanTermInMonths);

        // emit the event
        emit LoanRequested(_requestedLoanAmount, _loanTermInMonths, monthlyRepayment);
    }
}
