import { Outlet } from "react-router-dom";
import './Layout.css';

const StudentLayout = () => {
  return (
    <div className="Slayout_box">
      <h1 className="layout_heading">Student Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default StudentLayout;
