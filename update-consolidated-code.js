#!/usr/bin/env node

/**
 * Update Consolidated Code File
 * Run this script to refresh ALL_CODE_CONSOLIDATED.txt after making edits
 * Usage: node update-consolidated-code.js
 */

const fs = require("fs");
const path = require("path");

const PROJECT_DIR = __dirname;
const OUTPUT_FILE = path.join(PROJECT_DIR, "ALL_CODE_CONSOLIDATED.txt");

// Files to include in the consolidated file
const FILES_TO_INCLUDE = [
  // Backend files
  "campus-service-backend/package.json",
  "campus-service-backend/server.js",
  "campus-service-backend/src/app.js",
  "campus-service-backend/src/config/db.js",
  "campus-service-backend/src/models/User.js",
  "campus-service-backend/src/models/Request.js",
  "campus-service-backend/src/controllers/authController.js",
  "campus-service-backend/src/controllers/requestController.js",
  "campus-service-backend/src/middlewares/authMiddleware.js",
  "campus-service-backend/src/middlewares/errorHandler.js",
  "campus-service-backend/src/middlewares/requestLogger.js",
  "campus-service-backend/src/routes/authRoutes.js",
  "campus-service-backend/src/routes/requestRoutes.js",
  // Frontend files
  "campus-frontend/package.json",
  "campus-frontend/vite.config.js",
  "campus-frontend/eslint.config.js",
  "campus-frontend/src/main.jsx",
  "campus-frontend/src/App.jsx",
  "campus-frontend/src/App.css",
  "campus-frontend/src/index.css",
  "campus-frontend/src/services/api.js",
  "campus-frontend/src/pages/Login.jsx",
  "campus-frontend/src/pages/CreateRequest.jsx",
  "campus-frontend/src/pages/ViewRequests.jsx",
];

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function generateConsolidatedCode() {
  let content = `================================================================================
CAMPUS SERVICE REQUEST TRACKING SYSTEM - CONSOLIDATED CODE
Last Updated: ${new Date().toISOString()}
================================================================================

This file contains all source code from both frontend and backend.
Structure: BACKEND FILES → FRONTEND FILES
Update this file after every code modification.

`;

  let backendContent = "";
  let frontendContent = "";

  FILES_TO_INCLUDE.forEach((file) => {
    const fullPath = path.join(PROJECT_DIR, file);
    const fileContent = readFile(fullPath);

    if (fileContent) {
      const section = `------- ${file} -------\n${fileContent}\n\n`;

      if (file.startsWith("campus-service-backend")) {
        backendContent += section;
      } else {
        frontendContent += section;
      }
    }
  });

  content += `================================================================================
BACKEND FILES
================================================================================

${backendContent}`;

  content += `================================================================================
FRONTEND FILES
================================================================================

${frontendContent}`;

  content += `================================================================================
END OF CONSOLIDATED CODE
================================================================================
`;

  return content;
}

function main() {
  console.log("📝 Generating consolidated code file...");

  const consolidatedCode = generateConsolidatedCode();

  try {
    fs.writeFileSync(OUTPUT_FILE, consolidatedCode, "utf-8");
    console.log(`✅ Successfully updated: ${OUTPUT_FILE}`);
    console.log(`📊 File size: ${(consolidatedCode.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error("❌ Error writing consolidated file:", error.message);
    process.exit(1);
  }
}

main();
