**NOTE:** This project is archived as I have no intention of continuing to work on it. This code is very crusty and there most certainly better options out there. Just posting this in case someone might get some use out of it.

# figma-to-roblox-ui
Converts a figma project into Roblox UI

Figma plugins must be run from exactly two files a `code.js` file and a `ui.html` file. Use `npx webpack` to bundle the source into files that a Figma plugin can read.

must run `$env:NODE_OPTIONS="--openssl-legacy-provider"` in powershell first

## How to use

1. Run the figma plugin while selecting an object in figma.
2. When the plugin is finished it will ask you to save a .zip file. Export folder in the zip and place it somewhere easily accessible on your computer.
3. Load into Roblox studio with the lua plugin installed.
4. Click on the the import UI button and select any images + the lua file inside the exported folder.
5. The imported UI is using temp asset ids on your local system. Once you are happy w/ the UI you will have to manually upload and replace any image ids.