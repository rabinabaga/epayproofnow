import { Outlet } from "react-router-dom";
import "./Layout.css"; // Ensure this is correctly imported

const AccountantLayout = () => {
  return (
    <div className="layout-container">
        <h1 className="Alayout_heading">Accountant Dashboard</h1>
        <Outlet /> {/* Renders child components */}
     </div>
  );
};

export default AccountantLayout;
