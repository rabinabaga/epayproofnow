import { useState } from "react";
import { useBlockchainContext } from "./contractContext";
import { ethers, formatUnits } from "ethers";
import StudentReceipts from "./studentComponents/FetchReceipts";
import './Student.css'

const StudentAccess = () => {
  const { connectedUserDetails, currentAccount, contract } =
    useBlockchainContext();

  return <StudentReceipts />;
};
export default StudentAccess;
