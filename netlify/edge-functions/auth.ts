import type { Context } from "https://edge.netlify.com";

const VALID_USERNAME = Deno.env.get("AUTH_USERNAME") || "fhuika";
const VALID_PASSWORD = Deno.env.get("AUTH_PASSWORD") || "fhuika2026";

function verifyCredentials(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }
  const base64Credentials = authHeader.slice(6);
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(":");
  return username === VALID_USERNAME && password === VALID_PASSWORD;
}

export default async (request: Request, context: Context) => {
  const authHeader = request.headers.get("Authorization");

  if (!verifyCredentials(authHeader)) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected Content", charset="UTF-8"',
        "Content-Type": "text/plain",
      },
    });
  }
  return context.next();
};

export const config = {
  path: "/perubahan-iklim/*",
};
