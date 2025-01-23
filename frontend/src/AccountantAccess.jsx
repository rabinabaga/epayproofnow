import { useBlockchainContext } from "./contractContext";
import React, { useState } from "react";
import { ethers } from "ethers";
import GenerateReceiptsForm from "./accountantComponents/GenerateReceipts";
import './Acc.css'


const AccountantAccess = () => {
  const { contract } = useBlockchainContext();
  const [formData, setFormData] = useState({
    faculty: "",
    semester: "",
    feeAmount: "",
  });
  const [submitted, setSubmitted] = useState(false); // Tracks submission status

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
      const tx = await contract.setFee(
        formData.faculty,
        formData.semester,
        formData.feeAmount
      );

      await tx.wait();
      setSubmitted(true); // Set submitted to true upon success
      alert("Fee successfully set!");
    } catch (error) {
      console.error("Error setting fee:", error);
      alert("Failed to set fee. See console for details.");
    }
  };

  return (
    <div>
      {submitted ? (
        // Display Generate Receipts Form after fee is set
        <GenerateReceiptsForm />
      ) : (
        // Display Set Fee form before submission
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
        </div>
      )}
    </div>
  );
};

export default AccountantAccess;
