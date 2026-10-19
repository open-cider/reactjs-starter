# Open Cider + React starter

A small React (Vite, TypeScript, React Router) app with sign-in handled by
[`opencider-sdk`](https://www.npmjs.com/package/opencider-sdk).

## Run it

```bash
npm install
cp .env.example .env.local   # add VITE_OPENCIDER_SERVICE_KEY from dev.opencider.com
npm run dev
```

Open http://localhost:5173.

## How the flow works

1. `/login`: clicking the button runs the SDK's `initialize(serviceKey)`, which opens the Open Cider SSO popup and
   resolves with a client. The token is `client.token`.
2. The token is stored in `localStorage` and the user is sent to `/dashboard`.
3. `/dashboard` calls `createClient(token)` and `client.document.get()` and shows the avatar and profile card.
   If the token is rejected, it is cleared and the user returns to `/login`.
4. `RequireAuth` keeps visitors without a stored token out of `/dashboard`. "Sign out" clears the token.

```
src/
  pages/Login.tsx            sign-in page
  pages/Dashboard.tsx        protected page, loads the profile
  components/ProfileCard.tsx avatar image + profile card
  components/RequireAuth.tsx route gate
  lib/opencider.ts           SDK calls: initialize() and createClient()
  lib/session.ts             token storage
  lib/profile.ts             maps the profile document to the card
```

## Notes

- There is no server here, so the token is kept in `localStorage`, where any script on the page can read it.
  The Next.js starter keeps it in an httpOnly cookie instead.
- The service key is bundled into the browser code. The SDK README calls it a secret key, so check the Open
  Cider dashboard for a client-safe key or an allowed-origins setting.
- The Open Cider popup must post its token message to this app's origin (or `"*"`). Vite serves on
  `http://localhost:5173` by default, which differs from other starters. If the origin it posts to doesn't match,
  the browser drops the message and the sign-in button waits forever.
- When deploying, configure your host to serve `index.html` for unknown paths so `/dashboard` works on refresh.
- The profile card looks for an avatar under a key containing `avatar` (or `picture`/`photo`/`image`) holding an
  image URL or `data:image/...` string, and a name under `displayName`, `name` or `username`. Adjust
  `src/lib/profile.ts` for other keys.
- `opencider-sdk` is GPL-3.0 licensed.
