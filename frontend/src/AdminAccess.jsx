import { useState } from "react";
import { useBlockchainContext } from "./contractContext";

const AdminAccess = () => {
  const { contract } = useBlockchainContext();
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    faculty: "",
    semester: "",
    feeAmount: "",
    studentId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Register a user
  const registerUser = async () => {
    try {
      const tx = await contract.registerUser(
        formData.userAddress,
        formData.fullName,
        formData.role
      );
      await tx.wait();
      alert("✅ User registered successfully!");
    } catch (err) {
      console.error("Error registering user:", err);
      alert("❌ Error registering user");
    }
  };
  return (
    <div>
      Admin only area<br></br>
      <div>
        <h2>Register User</h2>
        <input
          type="text"
          name="userAddress"
          placeholder="User Address"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="role"
          placeholder="Role (Student or Accountant)"
          onChange={handleInputChange}
        />
        <button onClick={registerUser}>Register User</button>
      </div>
    </div>
  );
};
export default AdminAccess;
