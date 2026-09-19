// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const admin = await prisma.admin.findUnique({ 
          where: { email: credentials.email } 
        });
        
        if (!admin) return null;
        
        const isValid = await bcrypt.compare(credentials.password, admin.password);
        if (!isValid) return null;
        
        return { id: admin.id, email: admin.email };
      }
    })
  ],
  pages: {
    signIn: '/admin/login', // Redirects here if unauthorized
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };