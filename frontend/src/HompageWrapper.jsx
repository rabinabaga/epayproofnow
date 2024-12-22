const HomepageWrapper = ({ children }) => {
  return (
    <>
      <h2 style={{ color: "purple" }}>Welcome to Epayproof</h2>
      <h4>A permanent record of your college payments</h4>
      {/* <span style={{ fontSize: "1.3rem" }}>Get Started:</span> */}
      <span> {children}</span>
    </>
  );
};
export default HomepageWrapper;
