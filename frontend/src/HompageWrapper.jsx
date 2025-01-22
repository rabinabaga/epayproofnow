import './Homepage.css'; // Ensure the path is correct

const HomepageWrapper = ({ children }) => {
  return (
    <div className="homepage-wrapper">
      <h2 className="homepage-title">WELCOME TO E-PAYPROOF</h2>
      <h3 className="homepage-subtitle">Made For students : By students</h3>
      <h4 className="homepage-description">
        A permanent record of your college payments
      </h4>
      <div className="homepage-children">{children}</div>
    </div>
  );
};

export default HomepageWrapper;
