import React, { useState } from "react";
import { ethers } from "ethers";
import { useBlockchainContext } from "../contractContext";

import '../Student.css';

const SettleReceipt = ({ receiptId, feeAmount }) => {
  const { contract } = useBlockchainContext();
  const [transactionStatus, setTransactionStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(receiptId, "receiptid");

  const handleSettleReceipt = async () => {
    try {
      setIsLoading(true);
      setTransactionStatus("Transaction in progress...");

      const tx = await contract.settleReceipt(receiptId, {
        value: feeAmount,
      });

      // Wait for the transaction to be mined
      await tx.wait();
      setTransactionStatus("Receipt settled successfully!");
    } catch (error) {
      setTransactionStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Pay now</h2>

      <div>
        <button onClick={handleSettleReceipt} disabled={isLoading}>
          {isLoading ? "Processing..." : "Pay"}
        </button>
      </div>
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default SettleReceipt;