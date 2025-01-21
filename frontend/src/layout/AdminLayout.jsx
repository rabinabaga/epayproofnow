import { Outlet } from "react-router-dom";
import './Layout.css';

const AdminLayout = () => {
  return (
    <div className="layout_box">
      <h1 className="layout_heading">Admin Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
