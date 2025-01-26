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
    <div>
      <h2>Generate Receipts for Students</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Generate Receipts"}
        </button>
      </form>
    </div>
  );
}

export default GenerateReceiptsForm;
