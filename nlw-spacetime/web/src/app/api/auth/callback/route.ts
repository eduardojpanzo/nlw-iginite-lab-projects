import { api } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

  //   fazer o registro e obter o token
  const registerResponse = await api.post("/register", {
    code,
  });
  const { token } = registerResponse.data;

  const cookieExpiresInSeconds = 60 * 60 * 24 * 2; //2days

  //   redicionar na pagina root da nossa url e guardar o token nos cookei
  const redirectURL = new URL("/", request.url);
  return NextResponse.redirect(redirectURL, {
    headers: {
      "set-Cookie": `token= ${token}; Path=/; max-age=${cookieExpiresInSeconds}`,
    },
  });
}
