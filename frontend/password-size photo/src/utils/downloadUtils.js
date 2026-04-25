/**
 * Download image from URL to user's system
 * @param {string} imageUrl - The URL of the image to download
 * @param {string} fileName - The name to save the file as (optional)
 */
export const downloadImage = async (imageUrl, fileName = "passport_photo.jpg") => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image");

    // Get the blob
    const blob = await response.blob();

    // Create a blob URL
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download image. Please try again.");
  }
};
