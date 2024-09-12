// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";
//multisig is a wallet that needs multiple people to sign a transacation before it goes through
//quorum -the no of txn that must be signed before it goes through
//a way to track valid signers for the txn

//the wallet can handle multiple transactions, so users can know what txn they are to sign

/**
 * a struct to handle the Transaction details(recipient address,)
 * quorum needs to be set on deployment
 * 
 * transferFunction, withdrawfunction, updateQuorum
 * 
 * 
 * noOfValidSigners  can be more than quorum
 * no/ of approval must be equals to quorum for the txn to go theough
 * 
 */

contract Multi {
    uint8 public quorum;
    uint8 public noOfValidSigners;
    uint256 public txnCount;
    


    constructor(uint8 _quorum){
        quorum = _quorum;
    }

    struct Transaction {
        uint256 id;
        uint256 amount;
        address recipient;
        address sender;
        bool isCompleted;
        uint256 timeStamp;
        uint256 noOfApproval;
        address tokenAddress;
        address[] transactionSigners;

    }

    mapping(address => bool) isValidSigner; //  bool to check if address is a valid signer
    mapping(uint => Transaction) transactions; // tracking a transactionId to an address


    function transfer(uint256 _amount , address _recipient, address _tokenAddress) external {
        require(msg.sender != address(0),"address zero detected");
        require(isValidSigner[msg.sender],"invalid signer");

        require(_amount > 0, "can't send zero amount");
        require(_recipient !=address(0),"address zero detected");
        require(_tokenAddress != address(0), "address zero detected");
        require(IERC20(_tokenAddress).balanceOf(address(this))>= _amount, "insufficient funds");

        //update the count 

       uint256 _txId = txnCount +1;
       Transaction storage trxn = transactions[_txId];

       trxn.id = _txId;
       trxn.amount = _amount;
       trxn.recipient = _recipient;
       trxn.timeStamp = block.timestamp;
       trxn.tokenAddress = _tokenAddress;
       trxn.noOfApproval +=1;

    //    trxn.transacationSigners.push(msg.sender);

    }

    function approveTxn() external {

    }

    function withdraw() external {

    }

    function updateQuorum(uint256 _newQuorum) external {

    }
}
