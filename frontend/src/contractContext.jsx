import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import FeeManagementABI from "./FeeManagementABI.json";

// Create the context
export const BlockchainContext = createContext(null);

// Export a custom hook for consuming the context
export const useBlockchainContext = () => useContext(BlockchainContext);
