import { useBlockchainContext } from "./contractContext";
import EnterFeeForm from "./enterFeeForm";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import GenerateReceiptsForm from "./accountantComponents/GenerateReceipts";

const AccountantAccess = () => {
  const { contract } = useBlockchainContext();
  const [formData, setFormData] = useState({
    faculty: "",
    semester: "",
    feeAmount: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the setFee function from the contract
      const tx = await contract.setFee(
        formData.faculty,
        formData.semester,
        formData.feeAmount
      );

      await tx.wait();

      alert("Fee successfully set!");
    } catch (error) {
      console.error("Error setting fee:", error);
      alert("Failed to set fee. See console for details.");
    }
  };
  return (
    <div>
      <h2>Set Fee for Faculty and Semester</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Faculty:
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Semester:
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Fee Amount (in Wei):
            <input
              type="number"
              name="feeAmount"
              value={formData.feeAmount}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Set Fee</button>
      </form>
      <GenerateReceiptsForm />
    </div>
  );
};
export default AccountantAccess;
