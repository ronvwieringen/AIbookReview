import { NextAuthOptions } from "next-auth";
import { NextResponse } from "next/server";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Authenticate with Supabase Auth
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            return null;
          }

          // Get user profile from the database
          const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (userError || !userProfile) {
            return null;
          }

          // Update last login timestamp
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.user.id);

          return {
            id: data.user.id,
            email: data.user.email,
            name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || data.user.email,
            role: userProfile.role,
            image: userProfile.profile_picture_url,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };