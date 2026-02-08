# Consolidated Code Management Guide

## Overview
This project includes a consolidated code file (`ALL_CODE_CONSOLIDATED.txt`) that contains all source code from both the **frontend** and **backend** in a single file, stored at the project root outside both `campus-frontend` and `campus-service-backend` folders.

## Files Created

1. **ALL_CODE_CONSOLIDATED.txt** - The main consolidated code file (read-only reference)
2. **update-consolidated-code.js** - Script to regenerate the consolidated file

## How to Keep the Consolidated File Updated

### Option 1: Manual Update (Recommended for occasional edits)
After making changes to any code file, run:

```bash
node update-consolidated-code.js
```

This will regenerate `ALL_CODE_CONSOLIDATED.txt` with all the latest code.

### Option 2: Automatic Update (Using Watch Mode)
For continuous development, create a watch script. In the root APP directory:

```bash
# First, install watch tools globally (optional)
npm install -g chokidar-cli

# Run watch mode
chokidar "campus-frontend/src/**" "campus-service-backend/src/**" -c "node update-consolidated-code.js"
```

### Option 3: GitHub Hooks (If using Git)
Create a post-commit hook to auto-update after each commit:

**.git/hooks/post-commit** (Linux/Mac) or **.git/hooks/post-commit.bat** (Windows):
```bash
#!/bin/bash
node update-consolidated-code.js
```

Make it executable:
```bash
chmod +x .git/hooks/post-commit
```

## Supported Files

The consolidation includes:

### Backend
- `package.json`
- `server.js`
- All files in `src/` (config, models, controllers, middlewares, routes)

### Frontend
- `package.json`
- `vite.config.js`
- `eslint.config.js`
- All files in `src/` (main, App, CSS, services, pages)

## Location
**Path:** `d:\MCA\Projects\Campus Service Request Tracking System\APP\ALL_CODE_CONSOLIDATED.txt`

## File Organization
The consolidated file is organized as:
1. **Header with metadata** (timestamp, purpose)
2. **All Backend Files** (organized by folder structure)
3. **All Frontend Files** (organized by folder structure)

## Usage Tips

✅ **DO:**
- Run `update-consolidated-code.js` after significant code changes
- Use this file for quick reference and code review
- Update after completing feature implementations

❌ **DON'T:**
- Edit `ALL_CODE_CONSOLIDATED.txt` directly - it will be overwritten on next update
- Use it as the primary source - refer to original files for editing

## Quick Reference Commands

```bash
# Update consolidated file
node update-consolidated-code.js

# For Windows PowerShell
node .\update-consolidated-code.js

# From any directory (if path is set to APP folder)
cd "d:\MCA\Projects\Campus Service Request Tracking System\APP"
node update-consolidated-code.js
```

## File Size & Performance
- Current file size: ~80-100 KB (includes all code)
- Updates complete in < 100ms
- No impact on project performance

## Adding New Files
To include new files in the consolidation:
1. Edit `update-consolidated-code.js`
2. Add the file path to `FILES_TO_INCLUDE` array
3. Run the update script again

Example:
```javascript
FILES_TO_INCLUDE = [
  // ... existing files ...
  "campus-frontend/src/components/YourNewComponent.jsx",  // Add new entry
];
```

---

**Last Updated:** February 7, 2026
