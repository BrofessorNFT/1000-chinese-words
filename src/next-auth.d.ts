// src/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's database ID. */
      id: string;
    } & DefaultSession["user"]; // Keep the default properties like name, email, image
  }

  // If you also want to add properties to the User model type used in callbacks
  // interface User extends DefaultUser {
  //   // Add any custom fields you expect from the database user record here
  //   // role?: string;
  // }
}

// If you are using JWT strategy and want to add props to the token
// declare module "next-auth/jwt" {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     /** OpenID ID Token */
//     idToken?: string;
//     userId?: string; // Example: Add user ID to JWT
//   }
// }