import { useState } from "react";
import { useBlockchainContext } from "./contractContext";
import './AdminAccess.css';

const AdminAccess = () => {
  const { contract } = useBlockchainContext();
  const [userType, setUserType] = useState(""); // "student" or "accountant"
  const [formData, setFormData] = useState({
    userAddress: "",
    fullName: "",
    semester: "",
    faculty: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (userType === "student") {
        const tx = await contract.registerStudent(
          formData.userAddress,
          formData.fullName,
          formData.semester,
          formData.faculty
        );
        await tx.wait();
        alert("Student registered successfully!");
        setFormData({
          userAddress: "",
          fullName: "",
          semester: "",
          faculty: "",
        });
      } else if (userType === "accountant") {
        await contract.registerAccountant(
          formData.userAddress,
          formData.fullName
        );
        alert("Accountant registered successfully!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. See console for details.");
    }
  };

  return (
    <div>
      <h1>USER REGISTRATION</h1>
      <div>
        <button onClick={() => setUserType("student")}>Register Student</button>
        <button onClick={() => setUserType("accountant")}>
          Register Accountant
        </button>
      </div>

      {userType && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Address:
              <input
                type="text"
                name="userAddress"
                value={formData.userAddress}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Full Name:
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {userType === "student" && (
            <>
              <div>
                <label>
                  Semester:
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Faculty:
                  <input
                    type="text"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </>
          )}

          <button type="submit">
            Register {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </button>
        </form>
      )}
    </div>
  );
};
export default AdminAccess;
