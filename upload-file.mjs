import { GoogleAIFileManager } from '@google/generative-ai/server';
import { config } from 'dotenv';

// Load environment variables from .env
config();

/**
 * Uploads a local PDF file to the Gemini File API.
 * @param {string} filePath - The path to the local PDF file.
 */
async function uploadPdf(filePath) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: GOOGLE_GENERATIVE_AI_API_KEY is missing in .env');
    return;
  }

  // Initialize the GoogleAIFileManager with the API key
  const fileManager = new GoogleAIFileManager(apiKey);

  try {
    console.log(`⏳ Uploading ${filePath} to Gemini File API...`);
    
    // Upload the file using the FileManager API
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: 'application/pdf',
      displayName: 'Sample Document',
    });

    console.log('✅ Success: File uploaded');
    console.log(`📄 File URI: ${uploadResult.file.uri}`);
    return uploadResult.file.uri;
  } catch (error) {
    console.error('💥 Error uploading file:', error.message);
  }
}

// Test execution pointing to ./sample.pdf
uploadPdf('./sample.pdf');
