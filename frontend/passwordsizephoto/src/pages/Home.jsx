import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import ImageCropper from "../components/ImageCropper";
import { downloadImage } from "../utils/downloadUtils";

const Home = () => {
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleReset = () => {
    setResult(null);
    setActiveTab("upload");
  };

  const copyToClipboard = (url, type) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(type);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Passport Photo Generator
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Create compliant passport photos in seconds — ready for printing and submission.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {!result ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-8">
                  <button
                    onClick={() => setActiveTab("upload")}
                    className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all duration-200 ${
                      activeTab === "upload"
                        ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Direct Upload
                  </button>
                  <button
                    onClick={() => setActiveTab("crop")}
                    className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all duration-200 ${
                      activeTab === "crop"
                        ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Crop & Adjust
                  </button>
                </div>

                {/* Content */}
                <div>
                  {activeTab === "upload" ? (
                    <ImageUpload setResult={setResult} />
                  ) : (
                    <ImageCropper setResult={setResult} />
                  )}
                </div>

                {/* Helper text */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400">
                    Supports JPG and PNG formats • Standard 3:4 passport photo ratio
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your passport photos are ready
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Review and download your images below
                  </p>
                </div>

                <div className="p-6 md:p-8">
                  {/* Image Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {result.original && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium text-gray-700">Original Image</h3>
                          <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                            Source
                          </span>
                        </div>
                        <div className="bg-white rounded-md overflow-hidden border border-gray-200 mb-4">
                          <img
                            src={result.original}
                            alt="Original"
                            className="w-full object-cover max-h-48"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              downloadImage(
                                result.original,
                                `passport_original_${Date.now()}.jpg`
                              )
                            }
                            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-3 rounded-md border border-gray-300 transition"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => copyToClipboard(result.original, "original")}
                            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-3 rounded-md border border-gray-300 transition"
                          >
                            {copiedUrl === "original" ? "Copied!" : "Copy URL"}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-green-800">Final Result</h3>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                          12 Copies (3x4)
                        </span>
                      </div>
                      <div className="bg-white rounded-md overflow-hidden border border-green-200 mb-4">
                        <img
                          src={result.final}
                          alt="Final"
                          className="w-full object-cover max-h-48"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            downloadImage(
                              result.final,
                              `passport_final_${Date.now()}.jpg`
                            )
                          }
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-md transition shadow-sm"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => copyToClipboard(result.final, "final")}
                          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-3 rounded-md border border-gray-300 transition"
                        >
                          {copiedUrl === "final" ? "Copied!" : "Copy URL"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                    <p className="text-blue-800 text-sm">{result.message}</p>
                  </div>

                  {/* Tip Box */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tip:</span> Both images are available for download. 
                      The final image contains 12 passport-sized photos arranged in a 3x4 layout, 
                      perfect for printing on 4x6 photo paper.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() =>
                        downloadImage(
                          result.final,
                          `passport_photo_${Date.now()}.jpg`
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-sm"
                    >
                      Download Final
                    </button>
                    {result.original && (
                      <button
                        onClick={() =>
                          downloadImage(
                            result.original,
                            `passport_original_${Date.now()}.jpg`
                          )
                        }
                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-sm"
                      >
                        Download Original
                      </button>
                    )}
                    <a
                      href={result.final}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition border border-gray-300"
                    >
                      Open in Browser
                    </a>
                    <button
                      onClick={handleReset}
                      className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-lg transition shadow-sm"
                    >
                      Process Another Photo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-400">
            Your photos are processed locally in your browser — we never store or share your images.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;