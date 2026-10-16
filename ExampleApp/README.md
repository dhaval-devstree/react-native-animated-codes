# ExampleApp — react-native-animated-codes

Bare React Native app for trying `react-native-animated-codes` locally. It consumes the package straight from `..` (see `metro.config.js`), so edits in `../src` hot-reload in the app.

## Screens

- **Initial**: overview and a looping hero QR code.
- **Playground**: toggle every prop live (value, animation, shapes, colors, gradient, logo, label, size, quiet zone, ECL, duration, loop) and use play / reset / complete.
- **Showcase**: ready-made configurations, including custom module orders, a worklet easing, external `progress` and manual playback.
- **Barcodes**: `AnimatedBarcode` playground, pick any of the 110 formats (linear, 2D, MaxiCode) and toggle animation, colors, shapes and text.
- **Gallery**: every format rendered from its sample value, tap one to replay.

## Run

```sh
npm install

# iOS
bundle install
cd ios && bundle exec pod install && cd ..
npm run ios

# Android
npm run android
```

Start Metro on its own with `npm start` (add `-- --reset-cache` after changing `babel.config.js` or `metro.config.js`).

## Notes

- Reanimated 4 needs `react-native-worklets/plugin` as the last Babel plugin. It is already set in `babel.config.js`.
- Metro blocks `../node_modules` so the package's own dev copies of `react`, `react-native`, `react-native-svg` and `react-native-reanimated` are never bundled twice.
- Android debug and release builds are both signed with the debug keystore. Add your own release signing config before shipping a build.
