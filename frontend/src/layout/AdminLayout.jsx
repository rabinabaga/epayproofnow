import { Outlet } from "react-router-dom";
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin_box">
      <h1 id="admindash">Admin Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
