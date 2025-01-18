import { useState } from "react";
import { useBlockchainContext } from "../contractContext";


function GenerateReceiptsForm() {
  const { contract } = useBlockchainContext();
  const [formData, setFormData] = useState({
    faculty: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the generateReceiptsForFacultyAndSemester function
      const tx = await contract.generateReceiptsForFacultyAndSemester(
        formData.faculty,
        formData.semester
      );

      await tx.wait();

      alert("Receipts successfully generated!");
    } catch (error) {
      console.error("Error generating receipts:", error);
      alert("Failed to generate receipts. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Generate Receipt for Student</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="faculty" className="form-label">Faculty</label>
            <input
              type="text"
              id="faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="semester" className="form-label">Semester</label>
            <input
              type="text"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`form-button ${loading ? "form-button-loading" : ""}`}
          >
            {loading ? "Processing..." : "Generate Receipts"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GenerateReceiptsForm;
