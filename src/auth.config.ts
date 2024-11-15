import { CredentialsSignin } from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';

class CustomCredentialsError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
  }
}

const CredentialsSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const authConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validateFields = CredentialsSchema.safeParse(credentials);

        if (!validateFields.success) {
          throw new CustomCredentialsError('Something went wrong');
        }

        const { email, password } = validateFields.data;

        const query = await db.select().from(users).where(eq(users.email, email));
        const user = query[0];

        if (!user?.password || !bcrypt.compareSync(password, user.password)) {
          throw new CustomCredentialsError('Invalid identifier or password');
        }

        return user;
      },
    }),
    Google,
    GitHub,
  ],
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
