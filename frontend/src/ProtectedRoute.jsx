const ProtectedRoute = ({ role, currentRole, children }) => {
  if (role === currentRole) {
    return children;
  } else return <>Access Denied</>;
};
export default ProtectedRoute;
