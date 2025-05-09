// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma'; // Use our prisma instance

// Check that environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}
if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("Missing NEXTAUTH_SECRET environment variable");
}

export const authOptions: NextAuthOptions = {
  // Configure the Prisma adapter
  adapter: PrismaAdapter(prisma),

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here if needed later (e.g., GitHub, Email)
  ],

  // Secret for signing JWTs/session cookies
  secret: process.env.NEXTAUTH_SECRET,

  // Configure session strategy (database recommended with adapter)
  session: {
    strategy: "database", // Use database sessions

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Customize pages (optional)
  // pages: {
  //   signIn: '/auth/signin', // Example custom sign-in page
  //   signOut: '/auth/signout',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  //   verifyRequest: '/auth/verify-request', // (used for email/passwordless login)
  //   newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  // },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  callbacks: {
    // Use the session callback to add the user ID to the session object
    async session({ session, user }) {
        // Send properties to the client, like an access_token and user id from the user object.
        if (session.user) {
            session.user.id = user.id; // Add the user ID from the DB user record
        }
        return session;
    },
    // Add other callbacks if needed (e.g., jwt, signIn)
  },

  // Events (optional - e.g., for logging)
  // events: {},

  // Enable debug messages in the console if you are having problems
  // debug: process.env.NODE_ENV === 'development',
};

// Export the handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };