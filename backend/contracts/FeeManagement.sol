// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract FeeManagement is AccessControl {
    bytes32 public constant ACCOUNTANT_ROLE = keccak256("ACCOUNTANT_ROLE");
       bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");

    struct User {
        string fullName;
        string role; // "Student" or "Accountant"
    }

    struct FeeRecord {
        string faculty;
        string semester;
        uint256 feeAmount;
        uint256 generatedAt;
    }

    struct Receipt {
        string studentId;
        string faculty;
        string semester;
        uint256 feeAmount;
        uint256 timestamp;
    }

        struct Payment {
        address payer;
        uint256 amount;
        uint256 timestamp;
    }

 


    // Mappings
    mapping(address => User) public users; // Registered users
    mapping(address => Payment[]) public payments;
    mapping(string => mapping(string => FeeRecord)) public courseSemesterFees; // course => (semester => FeeRecord)

      FeeRecord[] public feeRecordsArray; // Flat array to store all records for easy retrieval

    Receipt[] public receipts; // Array of generated receipts

    // Events
    event UserRegistered(address userAddress, string fullName, string role);
    event FeeEntered(string faculty, string semester, uint256 feeAmount);
    event ReceiptGenerated(string studentId, string faculty, string semester, uint256 feeAmount, uint256 timestamp);
    event Debug(string message, string fullName, string role);
     event PaymentMade(address indexed payer, uint256 amount, uint256 timestamp);

    // Constructor: Assigns deployer as Admin
    constructor() {
_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Modifier: Ensures the user is a Student
    modifier onlyStudent() {
        require(keccak256(abi.encodePacked(users[msg.sender].role)) == keccak256(abi.encodePacked("Student")), "Not a Student");
        _;
    }

    // Register User (Admin only)
    function registerUser(address userAddress, string memory fullName, string memory role) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(bytes(users[userAddress].fullName).length == 0, "User already registered");
        users[userAddress] = User(fullName, role);


        // Assign ACCOUNTANT_ROLE if role is Accountant
        if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("Accountant"))) {
            _grantRole(ACCOUNTANT_ROLE, userAddress);
        }
              // Assign ACCOUNTANT_ROLE if role is Accountant
        if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("Student"))) {
            _grantRole(STUDENT_ROLE, userAddress);
        }
        emit UserRegistered(userAddress, fullName, role);
    }
function makePayment() external payable onlyRole(STUDENT_ROLE) {
    // Add the payment to the student's payments array
    payments[msg.sender].push(Payment(msg.sender, msg.value, block.timestamp));
}


function fetchPaymentOfConnectedStudent() 
    external 
    view 
    onlyRole(STUDENT_ROLE) 
    returns (Payment[] memory) 
{
    return payments[msg.sender];
}



        // Fetch User by MetaMask address
    function getUser() public view returns (User memory) {
        if(hasRole(DEFAULT_ADMIN_ROLE,msg.sender)){
                return User("admin", "Admin");
        }else{
        
        require(bytes(users[msg.sender].fullName).length > 0, "User not registered");
        return users[msg.sender];
        }
    }

    // Accountant enters fee details
 function enterFee(string memory faculty, string memory semester, uint256 feeAmount) 
    public 
    onlyRole(ACCOUNTANT_ROLE) 
{
    require(feeAmount > 0, "Fee amount must be greater than zero");
    courseSemesterFees[faculty][semester] = FeeRecord(faculty, semester, feeAmount, block.timestamp);
       feeRecordsArray.push(FeeRecord(faculty, semester, feeAmount, block.timestamp));


    emit FeeEntered(faculty, semester, feeAmount);
}

   // Function to retrieve all fee records as an array
    function getFees() public view returns (FeeRecord[] memory) {
        return feeRecordsArray;
    }


  
}
