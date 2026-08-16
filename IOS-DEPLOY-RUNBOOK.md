# GameScore Pro — iOS Deploy Runbook

## What's already done (Oracle, 2026-08-16)
- Capacitor 8 wrapper added (`ios/` is a full Xcode project, SPM-based — **no CocoaPods needed**)
- Bundle ID: `com.peakbpo.gamescorepro` · App name: **GameScore Pro**
- Web build synced into native shell (`ios/App/App/public/`)
- Haptics wired: success buzz on round save, warning buzz on invalid score (no-op on web)
- App icon + splash generated for all iOS sizes (source in `assets/`)
- Removed Replit dev-banner script; added `viewport-fit=cover` for notch/Dynamic Island
- App is 100% offline (localStorage) — the Express server is unused and not shipped

## One-time setup (Mac Mini)
1. Install **Xcode** from the Mac App Store (large download; do this first)
2. Xcode → Settings → Accounts → add your Apple ID
3. Enroll in the **Apple Developer Program** at developer.apple.com ($99/yr) — required for App Store; skip if only sideloading to your own phone

## Build & run on your iPhone (sanity check — do this before App Store)
```bash
git clone <repo> && cd GameScoreboard
npm install
npx vite build
npx cap sync ios
npx cap open ios
```
In Xcode:
1. Select the **App** target → Signing & Capabilities → set your **Team**
2. Plug in your iPhone (or use Wi-Fi debugging), select it as the run destination
3. Press ▶ Run — app installs on your phone
4. On the phone: Settings → General → VPN & Device Management → trust your developer cert

## Publish to the App Store
1. **App Store Connect** (appstoreconnect.apple.com) → My Apps → **+ New App**
   - Platform iOS · Name "GameScore Pro" · Bundle ID `com.peakbpo.gamescorepro` · SKU anything
2. In Xcode: select **Any iOS Device (arm64)** as destination → **Product → Archive**
3. Organizer opens → **Distribute App → App Store Connect → Upload**
4. In App Store Connect, fill out:
   - Screenshots (6.7" iPhone required — take them from your phone or the simulator)
   - Description, keywords, support URL
   - **Privacy policy URL** (required even for offline apps — one static page saying "no data collected" works; host on buildtrueco.com or a free Vercel page)
   - **App Privacy** questionnaire → select "Data Not Collected" (true: everything is on-device)
   - Category: Utilities or Sports
5. Submit for review. Typical turnaround: 24–48 hrs.

## Review risk notes (Guideline 4.2 — minimum functionality)
Mitigations already in place: fully offline, native haptics, native splash/status bar.
If rejected anyway, respond citing offline-first functionality, or add one more
native feature (e.g. `@capacitor/share` to share final scores) and resubmit.

## Regenerating icons
Source images live in `assets/` (icon-only.png, splash.png).
After changing them: `npx @capacitor/assets generate --ios`

## Known pre-existing issues (non-blocking)
- `npx tsc` reports type errors in `StatsPanel.tsx` and `server/storage.ts` (Replit
  boilerplate rot). Vite build does not type-check, so these don't block shipping.
- localStorage inside WKWebView can theoretically be evicted under storage pressure.
  Tier-2 improvement: migrate persistence to `@capacitor/preferences`.
