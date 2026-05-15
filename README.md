# Smart Queue Control + Express Food

QR-based dine-in queue management, pre-booked express food for highway travellers,
and parcel pickup orders — all without customer login.

Built with React 18, Vite 5, Tailwind CSS, React Router 6 and Framer Motion.

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # production bundle into dist/
npm run preview   # serve the production bundle locally
```

Dev server runs on http://localhost:5173 (or the next free port).

## Customer flows

| Route        | Purpose                                                      |
|--------------|--------------------------------------------------------------|
| `/qr`        | Table QR scan → name + mobile → joins live dine-in queue     |
| `/token`     | Token confirmation + live queue position and ETA             |
| `/express`   | Highway pre-order; cooking starts inside the 3 km zone       |
| `/parcel`    | Parcel order with pickup time + payment                      |
| `/payment`   | Post-payment confirmation                                    |
| `/tracking`  | Live status (dine-in / express / parcel) — opens from links  |
| `/check`     | "Already ordered?" — mobile lookup, no login                 |

## Restaurant operations

| Route        | Purpose                                  |
|--------------|------------------------------------------|
| `/admin`     | Owner dashboard, KPIs and revenue chart  |
| `/kitchen`   | Kitchen screen — live ticket flow        |
| `/staff`     | Counter / staff screen                   |
| `/orders`    | Today's orders log                       |
| `/display`   | In-store queue display board             |
| `/highway`   | Highway QR onboarding board              |
| `/whatsapp`  | WhatsApp engagement and re-engagement    |

## No-login order tracking

Customers are identified by their mobile number (captured on every flow).
After an order is placed, a WhatsApp deep-link to `/tracking?…` is sent to the
captured number. If they lose the chat, they can open `/check`, enter the same
mobile, and re-open the live tracker.

## Tech notes

- All data is mocked under `src/data/sampleData.js` — wire a real backend by
  replacing the imports there.
- Page-level transitions use Framer Motion. The route-level `AnimatePresence`
  was removed because React 18 StrictMode + `mode="wait"` deadlocks navigation
  in dev — pages mount fresh on every route change instead.
- Production bundle is split into `react`, `motion`, `charts`, `icons` chunks
  (see `vite.config.js`).

## Project layout

```
src/
├── App.jsx                  // route table
├── main.jsx                 // entry
├── index.css                // Tailwind layer
├── components/              // shared UI (Layout, PhoneFrame, banners…)
├── data/sampleData.js       // all mock data
└── pages/                   // one file per route
```
