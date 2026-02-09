# Harvest Valley RPG (Android)

This is an Android wrapper for the Harvest Valley RPG web application.

## Project Structure

*   `app/`: Android application module.
*   `web_src/`: Original web application source code.

## How to Build (AndroidIDE)

1.  Open this project in AndroidIDE.
2.  Wait for the project to sync.
3.  Click "Run" to build and install the APK.

## Development

The web assets are pre-built and located in `app/src/main/assets`.
If you modify the web source code in `web_src/`:

1.  Navigate to `web_src/`.
2.  Run `npm install`.
3.  Run `npm run build`.
4.  Copy the contents of `web_src/dist/` to `app/src/main/assets/`.
    *   Example command: `cp -r web_src/dist/* app/src/main/assets/`
5.  Rebuild the Android project.

## Requirements

*   Android SDK 35
*   Kotlin 2.1.0
*   Android Gradle Plugin 8.5.0
*   Gradle Wrapper 8.13-bin
