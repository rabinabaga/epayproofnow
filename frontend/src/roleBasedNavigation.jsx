import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RoleBasedNavigation = ({ userRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "Admin") {
      navigate("/admin/dashboard");
    } else if (userRole === "Accountant") {
      navigate("/accountant/dashboard");
    } else if (userRole === "Student") {
      navigate("/student/dashboard");
    }
  }, [userRole, navigate]);

  return null; // No UI, purely for redirection
};

export default RoleBasedNavigation;
