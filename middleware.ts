import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      return !!token
    },
  },
})

export const config = {
  matcher: [
    "/api/github/:path*",
  ],
}

