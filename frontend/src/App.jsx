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
import './App.css';

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
      console.error("❌ Error fetching user details:", err.message || err);
      alert("Error fetching user details. Ensure the user is registered.");
    }
  };

  const connectMetaMask = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setCurrentAccount(accounts[0]);

      // Initialize Contract
      setIsConnected(true);
      await handleGetUserDetails();
    } catch (error) {
      console.error("Error connecting to MetaMask:", error.message || error);
      alert("❌ Error connecting to MetaMask. Check console for details.");
    }
  };

  return (
    <>
      {isConnected ? (
        <p id="account_no">Connected account: {currentAccount}</p>
      ) : (
        <div className="container">
          <h1 id="wel">Welcome to Epayproof</h1>
          <p id="intro">A permanent record of your college payments</p>
          <button id="meta" onClick={connectMetaMask}>Connect MetaMask</button>
        </div>
      )}
      {connectedUserDetails?.role && (
        <p id="user_role">Connected as: {userRole || "Unknown"}</p>
      )}

      {connectedUserDetails && (
        <div className="box">
          <Router>
            <Routes>
              <Route
                index
                element={<RoleBasedNavigation userRole={userRole} />}
              />
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute role="Admin" currentRole={userRole}>
                      <AdminAccess />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/accountant/dashboard"
                element={
                  <ProtectedRoute role="Accountant" currentRole={userRole}>
                    <AccountantAccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute role="Student" currentRole={userRole}>
                    <StudentAccess />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </div>
      )}
    </>
  );
};

export default App;
