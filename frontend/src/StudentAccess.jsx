import { useState } from "react";
import { useBlockchainContext } from "./contractContext";
import { ethers, formatUnits } from "ethers";

const StudentAccess = () => {
  const { connectedUserDetails, currentAccount, contract } =
    useBlockchainContext();
  const [paymentList, setpaymentList] = useState([]);
  const makePayment = async () => {
    if (!currentAccount) {
      alert("Please connect MetaMask first!");
      return;
    }

    try {
      const tx = await contract.makePayment({
        value: ethers.parseEther("0.01"),
        gasLimit: 300000,
      });

      await tx.wait();
      alert("Payment successful!");
    } catch (error) {
      console.error("Payment failed:", error.reason);
    }
  };

  const fetchPaymentsOfConnectedUser = async () => {
    if (!currentAccount) {
      alert("Please connect MetaMask first!");
      return;
    }

    try {
      const paymentDetails = await contract.fetchPaymentOfConnectedStudent();

      const result = paymentDetails.map((payment) => {
        const date = new Date(Number(payment?.timestamp) * 1000);
        const timeStamp = date.toLocaleDateString();
        return {
          payer: payment.payer, // First element: Address of the payer
          amount: payment.amount, // Second element: Amount paid
          timestamp: timeStamp, // Third element: Timestamp
        };
      });
      console.log(result);

      setpaymentList(result);

      alert("Payments fetched successfully");
    } catch (error) {
      console.error("Payments fetch failed:", error.reason);
    }
  };

  return (
    <div>
      <h3>Student only area</h3>
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
      <div>
        <p>Make payment</p>
        <button onClick={makePayment}>0.01ETH</button>
      </div>
      <div>
        <button onClick={fetchPaymentsOfConnectedUser}>Fetch payments</button>
      </div>
      {paymentList.length > 0 && (
        <>
          Payments:
          <table style={{ border: "2px solid black" }}>
            <thead>
              <tr>
                <th>Amount(ETH)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentList.map((item) => {
                return (
                  <tr>
                    <td> Amount:{formatUnits(item?.amount, "ether")} </td>Date:
                    <td> {item.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
export default StudentAccess;
