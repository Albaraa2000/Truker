const { ComputerVisionClient, ApiKeyCredentials } = require("@azure/cognitiveservices-computervision");

// Replace with your own values
const endpoint = "https://truker.cognitiveservices.azure.com/";
const subscriptionKey = "ef5cc2f421ec4cb5b441e84b1e5af7dc";

// Initialize the Computer Vision client
const credentials = new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": subscriptionKey } });
const client = new ComputerVisionClient(credentials, endpoint);

// Function to perform OCR on an image
async function performOCR(imageUrl) {
  const result = await client.recognizePrintedText({ url: imageUrl });
  return result;
}

// Usage example
const imageUrl = "URL_TO_YOUR_IMAGE";
performOCR(imageUrl)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
