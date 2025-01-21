import { useState } from "react";
import { useBlockchainContext } from "../contractContext";

function GenerateReceiptsForm() {
  const { contract } = useBlockchainContext();
  const [formData, setFormData] = useState({
    faculty: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);
  const [receiptInfo, setReceiptInfo] = useState(null);

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
      const tx = await contract.generateReceiptsForFacultyAndSemester(
        formData.faculty,
        formData.semester
      );

      await tx.wait();

      setReceiptInfo({
        faculty: formData.faculty,
        semester: formData.semester,
      });

      alert("Receipts successfully generated!");
    } catch (error) {
      console.error("Error generating receipts:", error);
      alert("Failed to generate receipts. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-section">
      <h2 className="form-title">Generate Receipts for Students</h2>

      {!receiptInfo ? (
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
      ) : (
        <div className="receipt-details">
          <h3 className="receipt-details-title">Receipt Generation Info</h3>
          <p><strong>Faculty:</strong> {receiptInfo.faculty}</p>
          <p><strong>Semester:</strong> {receiptInfo.semester}</p>
        </div>
      )}
    </div>
  );
}

export default GenerateReceiptsForm;
