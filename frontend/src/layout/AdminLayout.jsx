import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <h1> USER REGISTRATION DASHBOARD</h1>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
