# How to Clear Browser Storage to Fix Infinite Loops

## Chrome/Edge:
1. **Open Developer Tools**: Press `F12` or right-click → "Inspect"
2. **Find the Application tab**: Look for "Application" in the top menu bar of dev tools
3. **Navigate to Storage**: In the left sidebar, you'll see:
   - Local Storage
   - Session Storage
   - IndexedDB
   - Cookies
   - etc.
4. **Clear localhost data**:
   - Click on "Local Storage" → expand it → click on "http://localhost:3000"
   - Right-click and select "Clear" or press Delete key
   - Do the same for "Session Storage"

## Firefox:
1. **Open Developer Tools**: Press `F12`
2. **Find the Storage tab**: Look for "Storage" in the top menu
3. **Clear data**: Similar process as Chrome

## Safari:
1. **Open Web Inspector**: Press `Cmd+Option+I`
2. **Find the Storage tab**: Look for "Storage" in the top menu
3. **Clear data**: Similar process

## Alternative Quick Method:
1. **Hard Refresh**: Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. **Or**: Right-click the refresh button → "Empty Cache and Hard Reload"

## What This Does:
- Clears any cached API responses
- Removes stored authentication tokens
- Resets any localStorage data that might be causing loops
- Forces the app to start fresh

## When to Use:
- When you see infinite loops in the browser console
- When the page keeps making the same API calls repeatedly
- When the app seems "stuck" in a loading state
- After stopping the development server due to infinite loops