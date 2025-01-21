import { useState } from "react";
import { useBlockchainContext } from "./contractContext";
import { ethers, formatUnits } from "ethers";
import StudentReceipts from "./studentComponents/FetchReceipts";
import "./StudentAccess.css";

const StudentAccess = () => {
    const { connectedUserDetails, currentAccount, contract } =
      useBlockchainContext();

    return (
    <div className="container" id="st-container">
      <StudentReceipts />
    </div>
  );
};
export default StudentAccess;
