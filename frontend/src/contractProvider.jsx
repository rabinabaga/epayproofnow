import { useEffect, useState } from "react";
import FeeManagementABI from "./FeeManagementABI.json";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import { BlockchainContext } from "./contractContext";
import { ethers } from "ethers";

export const BlockchainProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUserDetails, setConnectedUserDetails] = useState(null);
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const signerInstance = await browserProvider.getSigner();
          const feeManagementContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            FeeManagementABI,
            signerInstance
          );

          setProvider(browserProvider);
          setSigner(signerInstance);
          setContract(feeManagementContract);

          const address = await signerInstance.getAddress();
          setCurrentAccount(address);

          console.log("Blockchain initialized:", {
            provider: browserProvider,
            signer: signerInstance,
            contract: feeManagementContract,
            currentAccount: address,
          });
        } catch (error) {
          console.error("Error initializing blockchain:", error);
        }
      } else {
        console.error("MetaMask not found!");
      }
    };

    init();
  }, []);

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        signer,
        userRole,
        setUserRole,
        contract,
        currentAccount,
        setCurrentAccount,
        setContract,
        isConnected,
        setIsConnected,
        connectedUserDetails,
        setConnectedUserDetails,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
