# Daily Tracker – Mobile (Expo Go, SDK 54)

Native iOS/Android version of the Daily Tracker todo app, built with
**Expo SDK 54** so it runs directly in **Expo Go**. The web app in the
repository root is unaffected.

## Features (parity with the web app)

- Create / edit / delete tasks, with "every day" or specific weekdays
- Mark tasks done / ignored, undo, daily progress bar and streak
- **Drag & drop reordering** (long-press the grip handle), persisted
- **Statistics** charts (last 7 days + current month), rebuilt with
  `react-native-svg`
- All data stored locally on the device via `AsyncStorage`

## Run it

```bash
cd mobile
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app (SDK 54) on your iPhone or
Android phone. The app loads over the local network — phone and computer
must be on the same Wi-Fi (or use `npx expo start --tunnel`).

## Tech notes

- Drag & drop: `react-native-draggable-flatlist` + `react-native-gesture-handler`
  + `react-native-reanimated` (v4 / worklets, all bundled in Expo Go SDK 54).
- The whole screen is a single `DraggableFlatList` (header and charts are
  the list header/footer) so the drag gesture stays smooth — a list must
  not be nested inside a `ScrollView`.
- Storage is asynchronous (`AsyncStorage`), so `useAppState` loads data on
  mount and shows a spinner until ready.

## Pinned versions

Dependency versions are pinned to the Expo SDK 54 set. If you have network
access to the Expo API you can re-validate them with:

```bash
npx expo install --check
```
