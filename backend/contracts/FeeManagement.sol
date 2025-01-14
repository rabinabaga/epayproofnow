// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract FeeManagement is AccessControl {
    address public admin;
    bytes32 public constant ACCOUNTANT_ROLE = keccak256("ACCOUNTANT_ROLE");
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");

    // Constructor: Assigns deployer as Admin
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        admin = msg.sender;
    }

    // Modifier: Ensures the user is a Student
    modifier onlyStudent() {
        require(
            keccak256(abi.encodePacked(users[msg.sender].role)) == keccak256(abi.encodePacked("Student")),
            "Not a Student"
        );
        _;
    }

    // Fee structure: Faculty => Semester => Fee Amount
    mapping(string => mapping(string => uint256)) public feeMapping;


    // Mapping to track students by faculty and semester
    mapping(string => mapping(string => address[])) public studentsByFacultyAndSemester;

    struct User {
        string fullName;
        string role;     // "Student" or "Accountant"
        string semester; // Optional (only for students)
        string faculty;  // Optional (only for students)
        bool exists;     // To track if the user is registered
    }
    struct Receipt {
        uint256 id;
        address student;
        string faculty;
        string semester;
        uint256 feeAmount;
        string status; // "due" or "settled"
    }

    // Mapping to store user data by address
    mapping(address => User) private users;

    // Mapping of receipt ID to Receipt details
    mapping(uint256 => Receipt) public receipts;

    // Mapping of student address to their receipt IDs
    mapping(address => uint256[]) public studentReceipts;

    // Counter for receipt IDs
    uint256 public nextReceiptId;

    // Event for user registration
    event UserRegistered(address indexed userAddress, string fullName, string role);

    // Event for receipt settlement
    event ReceiptSettled(address indexed student, uint256 receiptId, uint256 amount);

    // Register a student
    function registerStudent(
        address _userAddress,
        string memory _fullName,
        string memory _semester,
        string memory _faculty
    ) public {
        require(!users[_userAddress].exists, "User already registered");

        users[_userAddress] = User({
            fullName: _fullName,
            role: "Student",
            semester: _semester,
            faculty: _faculty,
            exists: true
        });
         studentsByFacultyAndSemester[_faculty][_semester].push(_userAddress);
        _grantRole(STUDENT_ROLE, _userAddress);

        emit UserRegistered(_userAddress, _fullName, "Student");
    }

    // Register an accountant
    function registerAccountant(
        address _userAddress,
        string memory _fullName
    ) public {
        require(!users[_userAddress].exists, "User already registered");

        users[_userAddress] = User({
            fullName: _fullName,
            role: "Accountant",
            semester: "",
            faculty: "",
            exists: true
        });
        _grantRole(ACCOUNTANT_ROLE, _userAddress);

        emit UserRegistered(_userAddress, _fullName, "Accountant");
    }

    // Retrieve a user's details
    function getUser(address _userAddress)
        public
        view
        returns (
            string memory fullName,
            string memory role,
            string memory semester,
            string memory faculty
        )
    {
        if(hasRole(DEFAULT_ADMIN_ROLE,msg.sender)){
                return ("admin","Admin","","");
        }
        require(users[_userAddress].exists, "User not found");

        User memory user = users[_userAddress];
        return (user.fullName, user.role, user.semester, user.faculty);
    }

 function studentsByFacultyAndSemesterFunc(string memory _faculty, string memory _semester) 
    public 
    view 
    returns (address[] memory) 
{
    return studentsByFacultyAndSemester[_faculty][_semester];
}

    // Receipt structure


    // Add or update fee for a faculty and semester
    function setFee(string memory faculty, string memory semester, uint256 feeAmount) public onlyRole(ACCOUNTANT_ROLE)  {
        feeMapping[faculty][semester] = feeAmount;
    }

    function getFeeForFacultyAndSemester(string memory _faculty, string memory _semester) 
    public 
    view 
    returns (uint256) 
{
    return feeMapping[_faculty][_semester];
}



    // Generate receipts for all students in a specific faculty and semester
    function generateReceiptsForFacultyAndSemester(string memory faculty, string memory semester) public {
        address[] memory students = studentsByFacultyAndSemester[faculty][semester];
        require(students.length > 0, "No students registered for this faculty and semester");

        uint256 feeAmount = feeMapping[faculty][semester];
        require(feeAmount > 0, "Fee not set for this faculty and semester");

        for (uint256 i = 0; i < students.length; i++) {
            address student = students[i];
            uint256 receiptId = nextReceiptId++;

            receipts[receiptId] = Receipt({
                id: receiptId,
                student: student,
                faculty: faculty,
                semester: semester,
                feeAmount: feeAmount,
                status: "due"
            });

            studentReceipts[student].push(receiptId);
        }
    }

 

    // Mark a receipt as settled and transfer the amount to the admin
    function settleReceipt(uint256 receiptId) public payable {
        Receipt storage receipt = receipts[receiptId];

        require(receipt.student == msg.sender, "Not your receipt");
        require(keccak256(bytes(receipt.status)) == keccak256(bytes("due")), "Receipt already settled");
        require(msg.value == receipt.feeAmount, "Incorrect payment amount");

        (bool success, ) = admin.call{value: msg.value}("");
        require(success, "Payment transfer failed");

        receipt.status = "settled";

        emit ReceiptSettled(msg.sender, receiptId, msg.value);
    }

    // Get all receipts for a student
    function getReceiptsForStudent() public view returns (Receipt[] memory) {
        uint256[] memory receiptIds = studentReceipts[msg.sender];
        Receipt[] memory result = new Receipt[](receiptIds.length);

        for (uint256 i = 0; i < receiptIds.length; i++) {
            result[i] = receipts[receiptIds[i]];
        }

        return result;
    }
}
