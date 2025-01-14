import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import StudentAccess from "./StudentAccess";
import AccountantAccess from "./AccountantAccess";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminAccess from "./AdminAccess";
import { ethers } from "ethers";
import RoleBasedNavigation from "./roleBasedNavigation";
import { useBlockchainContext } from "./contractContext";
import HomepageWrapper from "./HompageWrapper";

const App = () => {
  const {
    connectedUserDetails,
    setIsConnected,
    setConnectedUserDetails,
    setUserRole,
    isConnected,
    userRole,
    contract,
    setCurrentAccount,
    currentAccount,
  } = useBlockchainContext();

  const handleGetUserDetails = async () => {
    try {
      const userDetails = await contract.getUser(currentAccount);
      console.log(userDetails[0], "userd", userDetails);
      let profileData;
      const [fullName, role, faculty, semester] = userDetails;

      setConnectedUserDetails({ fullName, role, faculty, semester });
      setUserRole(role);

      alert("✅ User detail fetched successfully!");
    } catch (err) {
      console.error("Error fetching user details :", err.reason);
      alert("❌ Error fetching user details");
    }
  };
  console.log(connectedUserDetails, "connectedUserDetailsf", userRole);

  // Initialize provider, signer, and contract

  //connect to metamask, fetch user, check role set role
  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setCurrentAccount(accounts[0]);
      setIsConnected(true);
      await handleGetUserDetails();
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };
  return (
    <>
      {isConnected ? (
        <p>Connected account: {currentAccount}</p>
      ) : (
        <HomepageWrapper>
          <button
            style={{
              color: "white",
              backgroundColor: "purple",
              width: "max-content",
              padding: "0.6 rem",
              border: "none",
            }}
            onClick={connectMetaMask}
          >
            Connect MetaMask
          </button>
        </HomepageWrapper>
      )}
      {connectedUserDetails?.role && (
        <p>Connected as: {userRole || "Unknown"}</p>
      )}

      {connectedUserDetails && (
        <div>
          <Router>
            <Routes>
              <Route
                index
                element={<RoleBasedNavigation userRole={userRole} />}
              ></Route>
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute role="Admin" currentRole={userRole}>
                      <AdminAccess />
                    </ProtectedRoute>
                  }
                ></Route>
              </Route>
              <Route
                path="/accountant/dashboard"
                element={
                  <ProtectedRoute role="Accountant" currentRole={userRole}>
                    <AccountantAccess />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute role="Student" currentRole={userRole}>
                    <StudentAccess />
                  </ProtectedRoute>
                }
              ></Route>
            </Routes>
          </Router>
        </div>
      )}
    </>
  );
};

export default App;
