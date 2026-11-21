# Notification Reader

**Notification Reader** is an automated voice announcer for Android built with React Native and Expo. The application listens to incoming system notifications in the background, filters them against customizable rules, and speaks messages out loud using Text-to-Speech (TTS). It includes on-device language identification (Ukrainian / Russian), smart audio ducking with independent volume management, grouped chat message parsing, and background persistence via an Android Foreground Service.

---

## Table of Contents

- [Features](#features)
- [Tech Stack & Key Packages](#tech-stack--key-packages)
- [Architecture & Core Services](#architecture--core-services)
- [Application Screens & UI Elements](#application-screens--ui-elements)
  - [1. Applications Screen](#1-applications-screen)
  - [2. Settings Screen](#2-settings-screen)
  - [3. Logs Screen](#3-logs-screen)
  - [4. Test Screen](#4-test-screen)
  - [5. Exit Tab](#5-exit-tab)
- [CI/CD: GitHub Actions Workflow](#cicd-github-actions-workflow)
- [How to Install on Android Using ADB](#how-to-install-on-android-using-adb)

---

## Features

- **Background Notification Interception:** Intercepts system notifications in real-time even when the app is in the background or killed, using Android's `NotificationListenerService` and React Native Headless JS.
- **Rule-Based Speech Filtering:** Configure speech rules per app package (e.g., WhatsApp, Telegram) and specific chat/channel titles, or allow all chats from an app.
- **Auto-Discovery:** Automatically indexes package names and chat titles as incoming notifications arrive, enabling one-tap rule configuration without manual typing.
- **On-Device Language Identification:** Detects whether notification content is in Ukrainian or Russian using character heuristics and Google ML Kit, selecting the optimal local TTS voice.
- **Smart Audio Ducking & Volume Management:** Plays speech announcements at an independent user-defined volume while ducking background audio, then smoothly restores previous system volume.
- **Duplicate Prevention:** Automatically avoids repeating consecutive identical messages from the same source.
- **Grouped Chat Handling:** Can extract and read only the latest incoming message from grouped notifications (such as messenger chats).
- **Persistent Foreground Service:** Keeps the application alive and resilient against Android battery killers and process termination.
- **Built-in Diagnostic Logging:** In-app inspection and management of notification events and runtime errors.

---

## Tech Stack & Key Packages

### Core Framework

- **React Native (v0.86)** & **React (v19)** — High-performance cross-platform mobile framework leveraging the New Architecture.
- **Expo SDK (v57)** & **Expo Router (v57)** — Development platform and file-based routing navigator for React Native.
- **TypeScript (v6)** — Static typing for maintainability and code reliability.

### Key NPM Packages

| Package                                                    | Purpose                                                                                                                                                                             |
| :--------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-native-android-notification-listener`               | Bridges Android's `NotificationListenerService` to React Native, launching a background Headless JS task on every incoming notification event.                                      |
| `@notifee/react-native`                                    | Manages Android Foreground Service notifications, notification channels, and keeps the background service alive.                                                                    |
| `expo-speech`                                              | Text-to-Speech (TTS) engine used to vocalize notification content with configurable languages, voices, and playback callbacks.                                                      |
| `expo-audio`                                               | Configures the mobile audio session mode (`interruptionMode: 'duckOthers'`), allowing TTS speech to lower other media volume while speaking.                                        |
| `react-native-volume-manager`                              | Reads and sets hardware media stream volume levels programmatically without showing the system volume slider UI.                                                                    |
| `@react-native-ml-kit/identify-languages`                  | On-device Google ML Kit language identifier used to determine the language of incoming messages.                                                                                    |
| `react-native-file-access`                                 | High-performance native file system access for writing and reading JSON indexes and log files (`notifications.log`, `errors.log`, `speech_rules.json`, `discovered_channels.json`). |
| `@react-native-async-storage/async-storage`                | Key-value persistent storage for user preferences (speech volume, mute status, logging toggle, grouped messages toggle).                                                            |
| `expo-notifications`                                       | Handles local test notification scheduling in the development/test screen.                                                                                                          |
| `expo-intent-launcher`                                     | Opens native Android settings screens (Notification Listener Settings, App Notification Settings, Battery Optimization Settings).                                                   |
| `react-native-reanimated` & `react-native-gesture-handler` | Fluid animations, collapsible sections, and responsive gesture interactions.                                                                                                        |
| `react-native-safe-area-context` & `react-native-screens`  | Handles Android status bar / navigation bar insets and optimized native screen containers.                                                                                          |

---

## Architecture & Core Services

The business logic is decoupled into specialized services located under `src/services/`:

```text
src/services/
├── DiscoveredChannelsService.ts  # Indexes observed apps and chat titles
├── ForegroundService.ts          # Starts/stops Android persistent notification
├── LanguageService.ts            # Fast regex + ML Kit language identification
├── LoggerService.ts              # File logging for notifications & errors
├── NotificationService.ts        # Notification payload processing entry point
├── SpeechQueueService.ts         # FIFO queue, volume ducking, and TTS playback
├── SpeechRulesService.ts         # App and channel whitelist rule engine
└── StorageService.ts             # AsyncStorage wrapper for user preferences
```

### 1. `NotificationService`

The entry point invoked by the Android Headless JS background task (`RNAndroidNotificationListenerHeadlessJsName`).

- Strips large icon payloads to optimize memory.
- Writes incoming data to `notifications.log` (if logging is enabled).
- Sends incoming sources (`app` and `title`) to `DiscoveredChannelsService`.
- Verifies if the notification matches rules in `SpeechRulesService`.
- Parses grouped messages (retrieving the latest message text when enabled).
- Strips sender name prefixes (`Sender: message`) and pushes the clean text to `SpeechQueueService`.

### 2. `SpeechQueueService`

A FIFO queue and audio session coordinator for Text-to-Speech.

- **De-duplication:** Tracks the last spoken text per source key (`app::title`) to prevent repeated speech on recurring notification updates.
- **Volume Management:** Backs up current system volume, applies the user-configured TTS volume level, and configures `expo-audio` to duck other playing media (`interruptionMode: 'duckOthers'`).
- **Sequential Playback:** Synthesizes speech sequentially using `expo-speech` with the voice determined by `LanguageService`.
- **Restoration:** Restores the user's initial system volume once the queue is completely drained.

### 3. `SpeechRulesService`

Stores and queries user speech filtering rules persisted in `speech_rules.json`.

- Dictates whether an app is enabled (`enabled: boolean`).
- Supports wildcard mode (`speakAll: boolean`) to read all notifications from an app.
- Supports individual channel/chat whitelists (`channels: string[]`).

### 4. `DiscoveredChannelsService`

Passively indexes applications and chat titles observed from incoming notifications into `discovered_channels.json`. This enables the UI to present discovered apps and channels as clickable chips, avoiding manual package name entry.

### 5. `LanguageService`

Determines the appropriate language code and TTS voice:

1. Fast regex lookup for language-specific letters:
   - Ukrainian: `[іїєґ]` → `uk-UA` (`uk-ua-x-hfd-local`)
   - Russian: `[ыэъё]` → `ru-RU` (`ru-ru-x-ruf-local`)
2. If the text contains no distinguishing characters or contains mixed scripts, calls `@react-native-ml-kit/identify-languages` for on-device machine-learning detection.
3. Falls back safely to Ukrainian if detection is ambiguous.

### 6. `ForegroundService`

Leverages Notifee to display a persistent ongoing notification with low importance (`notification_reader_channel`), maintaining process priority so Android does not kill the app in low-memory situations.

### 7. `LoggerService`

Appends timestamped event messages and error stack traces to persistent local files (`notifications.log` and `errors.log`) using `react-native-file-access`. Provides read and clear APIs for the diagnostic screen.

### 8. `StorageService`

Provides typed getters and setters for `AsyncStorage` values, including TTS volume level, mute state, initial volume cache, grouped messages toggle, and notification logging toggle.

---

## Application Screens & UI Elements

The user interface uses a bottom tab navigation layout defined in `src/app/_layout.tsx`.

```
┌────────────────────────────────────────────────────────┐
│                      SCREEN CONTENT                    │
│                                                        │
├────────────┬────────────┬────────────┬────────┬────────┤
│ Приложения │  Настройки │    Логи    │  Тест  │  Выход │
│   (Apps)   │ (Settings) │   (Logs)   │ (Test) │ (Exit) │
└────────────┴────────────┴────────────┴────────┴────────┘
```

### 1. Applications Screen (`/`)

Serves as the main rules dashboard (`SpeechRulesManager`):

- **Add App Rule Section (`AddAppRuleSection`):**
  - _Discovered Apps Chips:_ Shows buttons for apps detected in recent notifications. Tapping a chip immediately creates a rule for that app.
  - _Refresh Button:_ Re-reads discovered apps from the index file.
  - _Manual Input Field & Add Button:_ Text input to enter custom package names (e.g. `org.telegram.messenger`).
  - _Clear All Button:_ Clears discovered app history.
- **Rule Cards (`SpeechRuleCard`):**
  - _App Header & Master Switch:_ Displays package name and a switch to enable or disable speech rules for this app.
  - _Delete Button (`✕`):_ Removes the app rule after confirmation.
  - _"Speak all chats" Switch:_ When toggled on, vocalizes every notification from this app regardless of title.
  - _Active Channel Chips:_ Shows currently active channels/chats. Tapping an active chip removes it from the rule.
  - _Available Channels Chips:_ Shows auto-discovered channels from notifications. Tapping a chip adds it to the active whitelist.
  - _Custom Channel Input & Add Button:_ Allows manual addition of specific chat or contact names.

### 2. Settings Screen (`/settings`)

Configures system permissions, background service, volume, and message parsing:

- **Permissions Section (`Permissions`):**
  - _Notification Listener Permission:_ Shows Granted/Denied status with a button that directly opens the Android "Notification Read Access" settings page.
  - _Post Notifications Permission:_ Status and button to open app notification settings for Notifee.
  - _Battery Optimization Exemption:_ Status and shortcut to exempt the app from battery optimization so Android doesn't put the listener to sleep.
  - _Check Permissions Button:_ Re-checks all permissions on demand.
- **Foreground Service Toggle (`ForegroundServiceControl`):**
  - Switch to pin the ongoing foreground notification in the Android notification drawer.
- **Volume & Mute Control (`VolumeControl`):**
  - _Stepper:_ Adjusts speech output volume from `0%` to `100%` in increments of `10%`.
  - _Mute / Unmute Button:_ Quickly mutes all speech announcements without altering the volume level percentage.
- **Grouped Messages Toggle (`GroupedMessagesControl`):**
  - Switch to control whether multi-message notifications (e.g., chat apps grouping several messages) should be parsed to vocalize the latest incoming message instead of the summary text.

### 3. Logs Screen (`/logs`)

Provides real-time visibility into incoming payloads and errors (`LogViewer`):

- **Log Notifications Switch (`LogNotificationsControl`):**
  - Toggle to enable or disable recording incoming notifications to disk, saving storage and I/O when debugging is unnecessary.
- **Tab Selector:**
  - _Notifications Tab:_ Displays raw incoming notification data (package, title, message text, timestamps).
  - _Errors Tab:_ Displays caught errors, stack traces, and context tags.
- **Action Buttons:**
  - _Refresh:_ Reloads log contents from disk.
  - _Clear:_ Deletes both `notifications.log` and `errors.log` from device storage.
  - _Scroll to Bottom:_ Instantly scrolls to the most recent log entries.

### 4. Test Screen (`/test`)

A sandbox for testing TTS playback, voice quality, and language detection (`LanguageTester`):

- **Title & Body Inputs:** Editable fields to customize test notification contents.
- **Preset Buttons:** Quick test phrases including:
  1. Ukrainian (with unique letters: `і`, `ї`, `є`, `ґ`).
  2. Russian (with unique letters: `ы`, `э`, `ъ`, `ё`).
  3. Ukrainian (without unique letters → verified by ML Kit).
  4. Russian (without unique letters → verified by ML Kit).
  5. Mixed language text.
  6. Numbers only (tests fallback voice).
- **Detected Language Badge:** Displays real-time detected language (`uk-UA` or `ru-RU`) and target TTS voice name.
- **Send Notification Button:** Schedules a local notification via `expo-notifications`, allowing verification of the end-to-end background listener and speech pipeline.

### 5. Exit Tab (`/exit`)

- A bottom tab entry that intercepts the press event and calls `BackHandler.exitApp()` to cleanly exit the application.

---

## CI/CD: GitHub Actions Workflow

The project contains an automated build workflow configured in `.github/workflows/build-android.yml`.

### Workflow Triggers & Smart Filtering

To conserve GitHub Actions minutes, builds are executed on push to the `main` branch **only if the commit message includes a specific tag**:

```yaml
if: contains(github.event.head_commit.message, '[debug]') || contains(github.event.head_commit.message, '[release]')
```

- Include `[debug]` in the commit message to build a Debug APK (`assembleDebug`).
- Include `[release]` in the commit message to build a Release APK (`assembleRelease`).

### Build Pipeline Steps

1. **Environment Setup:** Checks out repository (`actions/checkout@v5`), sets up Node.js 26 with npm cache (`actions/setup-node@v5`), installs Temurin JDK 17 (`actions/setup-java@v5`), and configures Gradle caching (`gradle/actions/setup-gradle@v6`).
2. **Dependencies:** Installs project dependencies via `npm ci`.
3. **C++ / NDK Cache:** Caches CMake and native build artifacts (`android/app/.cxx`, `android/.cxx`, etc.) to significantly speed up compilation of React Native native modules.
4. **Build Type Detection:** Parses commit message to select Gradle task (`assembleDebug` or `assembleRelease`).
5. **Release Signing:** If `[release]` is specified, temporarily configures the debug keystore for signing so the APK can be sideloaded without requiring production private keys.
6. **Gradle Compilation:** Executes `./gradlew assemble... -PreactNativeArchitectures=arm64-v8a` targeting modern 64-bit Android devices.
7. **Artifact Upload:** Uploads the resulting APK as a workflow artifact named `app-debug.apk` or `app-release.apk`.

---

## How to Install on Android Using ADB

After a GitHub Actions build completes, you can download the generated APK and install it directly to an Android device using ADB (Android Debug Bridge).

ADB supports two connection modes:

- **USB Debugging** (via cable)
- **Wireless Debugging (Wi-Fi)** (cable-free over local network)

This guide covers the **Wireless Debugging (Wi-Fi)** method, which allows you to connect and install the build without any physical cables.

### 1. Prerequisites

- **Same Wi-Fi Network:** Ensure your computer and your Android device are connected to the same local Wi-Fi network.
- **Computer:** Install Android SDK Platform-Tools (which includes `adb`). Make sure `adb` is available in your terminal's `PATH`.
- **Android Device:** Android 11 or higher with **Developer Options** enabled.

### 2. Download the APK Artifact

1. Open the repository on GitHub.
2. Navigate to the **Actions** tab and select the completed workflow run.
3. Scroll down to the **Artifacts** section at the bottom of the summary page.
4. Download the `app-release.apk` (or `app-debug.apk`) file.
5. If GitHub downloads it as a `.zip` file, extract the APK file to a folder on your computer.

### 3. Enable Wireless Debugging on Android

1. Open **Settings** on your phone.
2. Navigate to **System** → **Developer Options** (or **Additional Settings** → **Developer Options** depending on OEM).
3. Scroll down and toggle on **Wireless debugging**.
4. Confirm the prompt to allow wireless debugging on your Wi-Fi network.

### 4. Pair and Connect via ADB

#### Step A: Pairing (First-time setup only)

1. Tap on the **Wireless debugging** text to open its settings screen.
2. Tap **Pair device with pairing code**.
3. You will see an IP address, a pairing port, and a 6-digit Wi-Fi pairing code (e.g. `192.168.1.50:37125` and `123456`).
4. In your terminal on your computer, run:
   ```bash
   adb pair <ip-address>:<pairing-port>
   ```
   _Example:_
   ```bash
   adb pair 192.168.1.50:37125
   ```
5. When prompted, enter the 6-digit pairing code:
   ```text
   Enter pairing code: 123456
   Successfully paired to 192.168.1.50:37125
   ```

#### Step B: Connect to the Device

1. On the main **Wireless debugging** screen, find the IP address and port under **IP address & Port** (note: this connection port is usually different from the pairing port).
2. Connect to your device using that IP and port:

   ```bash
   adb connect <ip-address>:<port>
   ```

   _Example:_

   ```bash
   adb connect 192.168.1.50:41253
   ```

   _Output:_

   ```text
   connected to 192.168.1.50:41253
   ```

3. Verify that your device is connected:
   ```bash
   adb devices
   ```
   _Output:_
   ```text
   List of devices attached
   192.168.1.50:41253    device
   ```

### 5. Install the Application

Run the following command, specifying the path to your downloaded APK:

```bash
adb install -r app-release.apk
```

#### Useful ADB Flags:

- `-r`: Replaces / reinstalls an existing application while keeping its data and cache intact.
- `-d`: Allows version code downgrade if an older version is being installed over a newer one.
- `-g`: Grants all requested runtime permissions automatically upon installation.

Example with full options:

```bash
adb install -r -d -g app-release.apk
```

### 6. Post-Installation Setup on Device

Once installed, open the app and configure the following on your device:

1. Navigate to the **Settings** tab.
2. Grant **Notification Read Access** (allows the app to intercept notifications).
3. Grant **Post Notifications** permission.
4. Disable **Battery Optimization** for the app so the background service runs uninterrupted.
5. In the **Applications** tab, enable the apps and channels you want to voice-announce.
