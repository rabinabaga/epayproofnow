import React, { useState } from "react";
import { useBlockchainContext } from "./contractContext";
import GenerateReceiptsForm from "./accountantComponents/GenerateReceipts";
import "./AccountantAccess.css";

const AccountantAccess = () => {
  const { contract } = useBlockchainContext();
  const [feeSet, setFeeSet] = useState(false);
  const [feeInfo, setFeeInfo] = useState(null); // Store fee info
  const [formData, setFormData] = useState({
    faculty: "",
    semester: "",
    feeAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tx = await contract.setFee(
        formData.faculty,
        formData.semester,
        formData.feeAmount
      );

      await tx.wait();

      setFeeSet(true); // Mark fee as set
      setFeeInfo({ ...formData }); // Save fee info
      alert("Fee successfully set!");
    } catch (error) {
      console.error("Error setting fee:", error);
      alert("Failed to set fee. See console for details.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Section: Set Fee */}
      <div className="dashboard-section">
        <h2 className="section-title">Set Student Fee Amount</h2>

        {!feeSet ? (
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
        ) : (
          <div className="output-info">
            <h3 className="output-title">Fee Details</h3>
            <p><strong>Faculty:</strong> {feeInfo.faculty}</p>
            <p><strong>Semester:</strong> {feeInfo.semester}</p>
            <p><strong>Fee Amount:</strong> {feeInfo.feeAmount} Wei</p>
          </div>
        )}
      </div>

      {/* Section: Generate Receipts */}
      {feeSet && <GenerateReceiptsForm />}
    </div>
  );
};

export default AccountantAccess;
