#!/bin/bash

# professional_dmg.sh
# Creates a polished macOS DMG with background and icon positioning.

APP_NAME="BrewUpdate"
VOL_NAME="BrewUpdate"
DMG_NAME="BrewUpdate.dmg"
STAGING_DIR="dist/dmg_staging"
BACKGROUND_IMG="docs/media/dmg_background.png"
ICON_SIZE=120
WINDOW_WIDTH=600
WINDOW_HEIGHT=450

# Path to the .app
APP_PATH="dist/BrewUpdate.app"

if [ ! -d "$APP_PATH" ]; then
    echo "Error: $APP_PATH not found. Run pyinstaller first."
    exit 1
fi

echo "Cleaning up..."
rm -f "dist/$DMG_NAME"
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"

echo "Preparing staging area..."
cp -R "$APP_PATH" "$STAGING_DIR/"
ln -s /Applications "$STAGING_DIR/Applications"

# Create a temporary read-write DMG with extra space
TEMP_DMG="dist/temp.dmg"
rm -f "$TEMP_DMG"

echo "Creating temporary writable DMG..."
hdiutil create -size 300m -srcfolder "$STAGING_DIR" -volname "$VOL_NAME" -fs HFS+ \
    -fsargs "-c c=64,a=16,e=16" -format UDRW "$TEMP_DMG"

# Mount the DMG
echo "Mounting DMG..."
DEVICE=$(hdiutil attach -readwrite -noverify -noautoopen "$TEMP_DMG" | egrep '^/dev/' | sed 1q | awk '{print $1}')
sleep 3

# Copy background image into the DMG (hidden)
mkdir "/Volumes/$VOL_NAME/.background"
cp "$BACKGROUND_IMG" "/Volumes/$VOL_NAME/.background/background.png"

# AppleScript to set background and positions
echo "Applying AppleScript styling..."
osascript <<APPLESCRIPT
tell application "Finder"
    tell disk "$VOL_NAME"
        open
        delay 2
        set the containerWindow to container window of disk "$VOL_NAME"
        set current view of containerWindow to icon view
        set toolbar visible of containerWindow to false
        set statusbar visible of containerWindow to false
        set the bounds of containerWindow to {400, 100, 400 + $WINDOW_WIDTH, 100 + $WINDOW_HEIGHT}
        
        set theViewOptions to the icon view options of containerWindow
        set icon size of theViewOptions to $ICON_SIZE
        set arrangement of theViewOptions to not arranged
        set background picture of theViewOptions to file "background.png" of folder ".background" of disk "$VOL_NAME"
        
        # Exact positions for icons
        set position of item "$APP_NAME.app" to {160, 240}
        set position of item "Applications" to {440, 240}
        
        update without registering applications
        delay 3
        close
    end tell
end tell
APPLESCRIPT

# Finalize and detach
echo "Syncing and unmounting..."
sync
hdiutil detach "$DEVICE"
sleep 5

# Convert to read-only compressed DMG
echo "Converting to final DMG..."
hdiutil convert "$TEMP_DMG" -format UDZO -imagekey zlib-level=9 -o "dist/$DMG_NAME"

# Final cleanup
rm -f "$TEMP_DMG"
rm -rf "$STAGING_DIR"

echo "Done! Professional DMG created at dist/$DMG_NAME"
