import React, { useState, useEffect } from "react";
import { useBlockchainContext } from "../contractContext";
import SettleReceipt from "./SettleReceipt";

const StudentReceipts = () => {
  const { contract } = useBlockchainContext();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReceiptId, setSelectedReceiptId] = useState(BigInt(-1));
  const [selectedFeeAmount, setSelectedFeeAmount] = useState(0);

  // Fetch receipts for the student
  const fetchReceipts = async () => {
    try {
      // Call the getReceiptsForStudent function
      const result = await contract.getReceiptsForStudent();
      console.log(result, "result");

      // Update the state with the fetched receipts
      setReceipts(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      setError("Failed to fetch receipts.");
      setLoading(false);
    }
  };

  // Fetch receipts on component mount
  useEffect(() => {
    fetchReceipts();
  }, []);

  if (loading) {
    return <div>Loading receipts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleSettleReceipt = (receiptId, feeAmount) => {
    setSelectedReceiptId(BigInt(receiptId));
    setSelectedFeeAmount(feeAmount);
  };

  return (
    <div>
      <h2>Your Receipts</h2>
      {receipts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Receipt ID</th>
              <th>Faculty</th>
              <th>Semester</th>
              <th>Fee Amount (Wei)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.id.toString()}>
                <td>{receipt.id.toString()}</td>
                <td>{receipt.faculty}</td>
                <td>{receipt.semester}</td>
                <td>{receipt.feeAmount.toString()}</td>
                <td>{receipt.status}</td>
                <td>
                  <button
                    onClick={() =>
                      handleSettleReceipt(receipt.id, receipt.feeAmount)
                    }
                  >
                    Settle receipt
                  </button>
                  {selectedReceiptId !== BigInt(-1) && (
                    <SettleReceipt
                      receiptId={selectedReceiptId}
                      feeAmount={selectedFeeAmount}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No receipts found.</p>
      )}
    </div>
  );
};

export default StudentReceipts;
