import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";

const ImageCropper = ({ setResult }) => {
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  // 1. select image
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFileName(file.name);
      setError("");
    }
  };

  // 2. get crop area
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 3. convert crop to file
  const getCroppedImage = async () => {
    const imageObj = await fetch(image);
    const blob = await imageObj.blob();

    const croppedFile = new File([blob], "cropped.jpg", {
      type: "image/jpeg",
    });

    return croppedFile;
  };

  // 4. upload to backend
  const handleUpload = async () => {
    if (!image) {
      setError("Please select and crop an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const croppedFile = await getCroppedImage();
      const formData = new FormData();
      formData.append("image", croppedFile);

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/image/upload",
        formData
      );

      setResult(res.data);
      setImage(null);
      setFileName("");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload & Crop Image (Passport)</h2>

      {/* file input */}
      <div className="border-2 border-dashed border-green-300 rounded-lg p-6 mb-4 text-center hover:border-green-500 transition">
        <input 
          type="file" 
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          id="crop-file-input"
        />
        <label htmlFor="crop-file-input" className="cursor-pointer">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-gray-600">Click to select an image to crop</p>
          {fileName && <p className="text-sm text-green-600 mt-2">Selected: {fileName}</p>}
        </label>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* cropper */}
      {image && (
        <div className="mb-6">
          <p className="text-gray-600 mb-4 text-sm">Adjust crop area (3:4 passport ratio)</p>
          <div style={{ position: "relative", width: "100%", height: 400 }} className="border border-gray-300 rounded">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={3 / 4}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          
          {/* Zoom control */}
          <div className="mt-4">
            <label className="text-gray-700 text-sm">Zoom</label>
            <input 
              type="range" 
              min={1} 
              max={3} 
              step={0.1} 
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* buttons */}
      <div className="flex gap-4">
        {image && (
          <button 
            onClick={() => setImage(null)}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Cancel
          </button>
        )}
        <button 
          onClick={handleUpload}
          disabled={loading || !image}
          className={`flex-1 ${image ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'} disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition`}
        >
          {loading ? "Processing..." : image ? "Crop & Upload" : "Select Image First"}
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;