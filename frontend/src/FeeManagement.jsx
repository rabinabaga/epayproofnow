import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import FeeManagementABI from "./FeeManagementABI.json"; // ABI JSON file of the contract

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const FeeManagementApp = () => {
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [userRole, setUserRole] = useState(""); // "Student", "Accountant", or "Admin"
  const [receipts, setReceipts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    faculty: "",
    semester: "",
    feeAmount: "",
    studentId: "",
  });

  const [connectedUserDetails, setConnectedUserDetails] = useState(null);

  // Initialize provider, signer, and contract
  useEffect(() => {
    const init = async () => {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signerInstance = await browserProvider.getSigner();
      const feeManagementContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        FeeManagementABI,
        signerInstance
      );

      setProvider(browserProvider);
      setSigner(signerInstance);
      setContract(feeManagementContract);

      const address = await signerInstance.getAddress();
      const user = await feeManagementContract.users(address);
      // setUserRole(user.role); // Set the role of the connected user
    };

    init();
  }, []);

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Register a user
  const registerUser = async () => {
    try {
      const tx = await contract.registerUser(
        formData.userAddress,
        formData.fullName,
        formData.role
      );
      await tx.wait();
      alert("✅ User registered successfully!");
    } catch (err) {
      console.error("Error registering user:", err);
      alert("❌ Error registering user");
    }
  };
  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setCurrentAccount(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };
  // Enter fee details (Accountant only)
  const enterFee = async () => {
    try {
      const tx = await contract.enterFee(
        formData.faculty,
        formData.semester,
        ethers.parseUnits(formData.feeAmount, "ether")
      );
      await tx.wait();
      alert("✅ Fee entered successfully!");
    } catch (err) {
      console.error("Error entering fee:", err);
      alert("❌ Error entering fee");
    }
  };

  // Generate receipt (Accountant only)
  const generateReceipt = async () => {
    try {
      const tx = await contract.generateReceipt(
        formData.studentId,
        formData.faculty,
        formData.semester
      );
      await tx.wait();
      alert("✅ Receipt generated successfully!");
    } catch (err) {
      console.error("Error generating receipt:", err);
      alert("❌ Error generating receipt");
    }
  };

  // Fetch all receipts
  const fetchReceipts = async () => {
    try {
      const receipts = await contract.getAllReceipts();
      const formattedReceipts = receipts.map((receipt) => ({
        studentId: receipt.studentId,
        faculty: receipt.faculty,
        semester: receipt.semester,
        feeAmount: ethers.formatUnits(receipt.feeAmount, "ether"),
        timestamp: new Date(receipt.timestamp * 1000).toLocaleString(),
      }));
      setReceipts(formattedReceipts);
    } catch (err) {
      console.error("Error fetching receipts:", err);
    }
  };

  // Clear receipts (Admin only)
  const clearReceipts = async () => {
    try {
      const tx = await contract.clearReceipts();
      await tx.wait();
      alert("✅ Receipts cleared successfully!");
    } catch (err) {
      console.error("Error clearing receipts:", err);
      alert("❌ Error clearing receipts");
    }
  };

  const handleGetUserDetails = async () => {
    try {
      const userDetails = await contract.getUser();
      const profileData = {
        fullName: userDetails.fullName,
        role: userDetails.role,
      };
      setConnectedUserDetails(profileData);
      setUserRole(userDetails?.role);
      alert("✅ User detail fetched successfully!");
    } catch (err) {
      console.error("Error entering fee:", err);
      alert("❌ Error entering fee");
    }
  };

  return (
    <div>
      <h1>Fee Management System</h1>
      {isConnected ? (
        <p>Connected as: {currentAccount}</p>
      ) : (
        <button onClick={connectMetaMask}>Connect MetaMask</button>
      )}
      {connectedUserDetails?.role && (
        <p>Connected as: {userRole || "Unknown"}</p>
      )}
      {currentAccount !== null &&
        (connectedUserDetails === null ? (
          <button onClick={handleGetUserDetails}>Enter Dashboard</button>
        ) : (
          ""
        ))}
      {connectedUserDetails !== null && (
        <div>
          <h2>Profile Information:</h2>
          <p>Full Name: {connectedUserDetails.fullName}</p>
          <p>Role : {connectedUserDetails.role}</p>
        </div>
      )}
      {/* Register User */}

      {/* Enter Fee */}
      {userRole === "Accountant" && (
        <div>
          <h2>Enter Fee</h2>
          <input
            type="text"
            name="faculty"
            placeholder="Faculty"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="semester"
            placeholder="Semester"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="feeAmount"
            placeholder="Fee Amount (ETH)"
            onChange={handleInputChange}
          />
          <button onClick={enterFee}>Enter Fee</button>
        </div>
      )}

      {/* Generate Receipt */}
      {userRole === "Accountant" && (
        <div>
          <h2>Generate Receipt</h2>
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="faculty"
            placeholder="Faculty"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="semester"
            placeholder="Semester"
            onChange={handleInputChange}
          />
          <button onClick={generateReceipt}>Generate Receipt</button>
        </div>
      )}

      {/* Fetch Receipts */}
      <div>
        <h2>Receipts</h2>
        <button onClick={fetchReceipts}>Fetch Receipts</button>
        {receipts.map((receipt, index) => (
          <div key={index}>
            <p>Student ID: {receipt.studentId}</p>
            <p>Faculty: {receipt.faculty}</p>
            <p>Semester: {receipt.semester}</p>
            <p>Fee Amount: {receipt.feeAmount} ETH</p>
            <p>Timestamp: {receipt.timestamp}</p>
            <hr />
          </div>
        ))}
      </div>

      {/* Clear Receipts */}
      {userRole === "Admin" && (
        <div>
          <h2>Clear Receipts</h2>
          <button onClick={clearReceipts}>Clear Receipts</button>
        </div>
      )}
    </div>
  );
};

export default FeeManagementApp;
