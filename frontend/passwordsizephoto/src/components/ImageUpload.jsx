import { useState } from "react";
import { uploadImage } from "../api/imageApi";

const ImageUpload = ({ setResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setError("");

    try {
      const res = await uploadImage(formData);
      setResult(res);
      setFile(null);
      setFileName("");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Image</h2>
      
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 mb-4 text-center hover:border-blue-500 transition">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-600">Click to select an image</p>
          {fileName && <p className="text-sm text-blue-600 mt-2">Selected: {fileName}</p>}
        </label>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <button 
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
      >
        {loading ? "Processing..." : "Upload & Process"}
      </button>
    </div>
  );
};

export default ImageUpload;