import { GoogleAIFileManager } from '@google/generative-ai/server';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env
config();

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.error('❌ Error: GOOGLE_GENERATIVE_AI_API_KEY is missing in .env');
  process.exit(1);
}

const fileManager = new GoogleAIFileManager(apiKey);
const courcesDir = './Cources';

async function uploadAll() {
  try {
    if (!fs.existsSync(courcesDir)) {
      console.error(`❌ Error: Directory ${courcesDir} does not exist`);
      return;
    }

    const files = fs.readdirSync(courcesDir).filter(file => file.endsWith('.pdf'));

    if (files.length === 0) {
      console.log('⚠️ No PDF files found in the Cources directory.');
      return;
    }

    console.log(`📂 Found ${files.length} PDF files. Uploading to Gemini File API...\n`);

    const results = {};

    for (const file of files) {
      const filePath = path.join(courcesDir, file);
      
      // Clean filename to make a valid uppercase javascript variable name
      const varName = file
        .replace(/\.pdf$/i, '')
        .toUpperCase()
        .replace(/[^A-Z0-9_]/g, '_')
        .replace(/__+/g, '_')
        .replace(/^_+|_+$/g, '') + '_URI';

      console.log(`⏳ Uploading: ${file} as variable ${varName}...`);
      
      const uploadResult = await fileManager.uploadFile(filePath, {
        mimeType: 'application/pdf',
        displayName: file.replace(/\.pdf$/i, ''),
      });

      results[varName] = uploadResult.file.uri;
      console.log(`✅ Success: ${file} -> ${uploadResult.file.uri}\n`);
    }

    console.log('\n========================================================================');
    console.log('--- COPY AND PASTE THE CODE BELOW INTO /src/app/api/chat/route.ts ---');
    console.log('========================================================================\n');
    console.log('// Individual Course File URIs');
    for (const [varName, uri] of Object.entries(results)) {
      console.log(`const ${varName} = "${uri}";`);
    }

    console.log('\n// Course URIs Mapping');
    console.log('const COURSE_URIS: Record<string, string> = {');
    for (const [varName, uri] of Object.entries(results)) {
      const courseKey = varName.replace('_URI', '');
      console.log(`  "${courseKey}": ${varName},`);
    }
    console.log('};\n');

  } catch (error) {
    console.error('💥 Error during upload process:', error.message);
  }
}

uploadAll();
