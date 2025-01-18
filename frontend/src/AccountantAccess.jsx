import React, { useState } from "react";
import { useBlockchainContext } from "./contractContext";
import GenerateReceiptsForm from "./accountantComponents/GenerateReceipts";
import "./AccountantAccess.css";

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
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Set Student Fee Amount </h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="faculty" className="form-label">Faculty</label>
            <input
              type="text"
              id="faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="semester" className="form-label">Semester</label>
            <input
              type="text"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="feeAmount" className="form-label">Fee Amount (in Wei)</label>
            <input
              type="number"
              id="feeAmount"
              name="feeAmount"
              value={formData.feeAmount}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="form-button">Set Fee</button>
        </form>

        <div className="receipts-section">
          <GenerateReceiptsForm />
        </div>
      </div>
    </div>
  );
};

export default AccountantAccess;
