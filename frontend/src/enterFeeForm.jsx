import React, { useState } from "react";
import { ethers } from "ethers";
import { useBlockchainContext } from "./contractContext";

const EnterFeeForm = () => {
  const [faculty, setFaculty] = useState("");
  const [semester, setSemester] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [status, setStatus] = useState("");
  const { contract } = useBlockchainContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      // Call the enterFee function
      const tx = await contract.enterFee(
        faculty,
        semester,
        ethers.parseEther(feeAmount)
      );

      await tx.wait();
      setStatus("Fee entered successfully!");
      setFaculty("");
      setSemester("");
      setFeeAmount("");
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Enter Fee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Faculty:</label>
          <input
            type="text"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Semester:</label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fee Amount (in ETH):</label>
          <input
            type="number"
            step="0.01"
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default EnterFeeForm;
