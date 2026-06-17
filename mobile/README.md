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

## Run it (open with a link, no QR scan needed)

On your **computer** (not the phone), run once:

```bash
cd mobile
npm install
npm run tunnel
```

The terminal then prints a line like:

```
› Metro waiting on exp://xxxx-anonymous-8081.exp.direct
```

That `exp://…` line **is the link**. Open it on your iPhone (e.g. send it
to yourself via Messages/Mail and tap it) — it launches the app inside the
**Expo Go** app (SDK 54). The `--tunnel` mode works even on mobile data or
a different Wi-Fi.

> Plain `npm start` also works and prints an `exp://192.168.x.x` link, but
> that one only works when the phone is on the same Wi-Fi as the computer.

Requirements: install the **Expo Go** app from the App Store, and keep the
computer running while you use the app (the computer hosts it).

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
