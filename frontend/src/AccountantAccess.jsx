import { useBlockchainContext } from "./contractContext";
import EnterFeeForm from "./enterFeeForm";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const AccountantAccess = () => {
  const { connectedUserDetails, contract } = useBlockchainContext();

  const [feeList, setFeeList] = useState([]);

  const fetchFees = async () => {
    if (!connectedUserDetails) {
      alert("Please connect MetaMask first!");
      return;
    }

    try {
      const fees = await contract.getFees();

      const processedFees = fees.map((fee) => {
        const date = new Date(
          Number(fee.generatedAt) * 1000
        ).toLocaleDateString();
        return {
          faculty: fee.faculty,
          semester: fee.semester,
          feeAmount: ethers.formatUnits(fee.feeAmount, "ether"), // Convert to ETH
          generatedAt: date,
        };
      });

      setFeeList(processedFees);

      alert("Fees fetched successfully");
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };
  return (
    <div>
      <h3>Accountant only area</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <td>{connectedUserDetails.fullName}</td>
        </tbody>
      </table>
      <EnterFeeForm />
      <button onClick={fetchFees}>Fetch fees</button>
      <h2>Fee Records</h2>
      {feeList.length === 0 ? (
        <p>No fees available</p>
      ) : (
        <ul>
          {feeList.map((fee, index) => (
            <li key={index}>
              <p>Faculty: {fee.faculty}</p>
              <p>Semester: {fee.semester}</p>
              <p>Fee Amount: {fee.feeAmount} ETH</p>
              <p>Generated At: {fee.generatedAt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AccountantAccess;
