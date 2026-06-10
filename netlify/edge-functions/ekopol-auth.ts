// Basic Auth gate for the EkologiPolitik course section.
// Password is read from the Netlify environment variable EKOPOL_PASSWORD
// (set via `netlify env:set EKOPOL_PASSWORD ...`) so it never lives in the
// public Git repository. Any username is accepted; only the password is checked.

import type { Context } from "https://edge.netlify.com";

export default async (request: Request, _context: Context) => {
  const password = Netlify.env.get("EKOPOL_PASSWORD") ?? "";
  const header = request.headers.get("authorization") ?? "";

  if (password && header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice("Basic ".length));
      const supplied = decoded.slice(decoded.indexOf(":") + 1);
      if (supplied === password) {
        // Authorized — let the request continue to the static asset.
        return;
      }
    } catch {
      // Malformed header — fall through to the 401 challenge.
    }
  }

  return new Response(
    "Akses terbatas. Materi mata kuliah Ekologi Politik memerlukan kata sandi dari pengajar.",
    {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="EkologiPolitik", charset="UTF-8"',
        "content-type": "text/plain; charset=utf-8",
      },
    },
  );
};

export const config = {
  path: ["/EkologiPolitik", "/EkologiPolitik/*"],
};
