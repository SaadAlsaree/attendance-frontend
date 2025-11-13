import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { fetchAuth } from './fetch-client';
import { User } from 'next-auth';
import { Role } from '@/types/next-auth';

const authOption: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: 'jwt',
        maxAge: 8 * 60 * 60, // 8 hours
    },
    pages: {
        signIn: '/login',
        error: '/error',
        signOut: '/signout',
    },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                userLogin: { label: 'User Login', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.userLogin || !credentials?.password) {
                    return null;
                }

                try {
                    const response = await fetchAuth.post(
                        `/auth/login`,
                        {
                            userLogin: credentials.userLogin,
                            password: credentials.password,
                        }
                    );

                    // Check if the response is successful and has data
                    if (response && response.isSuccess && response.data) {
                        const userData = response.data;

                        return {
                            id: userData.userId,
                            name: credentials.userLogin, // Use the login as name since it's not in response
                            fullName: credentials.userLogin, // You might want to add fullName to your API response
                            email: credentials.userLogin, // You might want to add email to your API response
                            accessToken: userData.token,
                            roles: [{ id: '1', name: 'User', value: 'User' }], // Extract from JWT token or add to API response
                        } as User;
                    }
                    return null;
                } catch (error) {
                    console.error('Authentication error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    roles: user.roles,
                    accessTokenExpires: Date.now() + 8 * 60 * 60 * 1000, // 8 hours from now
                };
            }

            // Return previous token if the access token has not expired yet
            const accessTokenExpires = token.accessTokenExpires as number;
            if (Date.now() < accessTokenExpires) {
                return token;
            }

            // Access token has expired, set error flag
            return {
                ...token,
                error: "RefreshAccessTokenError",
            };
        },
        async session({ session, token }) {
            if (token) {
                session.accessToken = token.accessToken as string | undefined;
                session.roles = token.roles as Role[] | undefined;
                session.error = token.error as string | undefined;
                session.user = {
                    id: token.sub || '',
                    fullName: token.fullName as string | null,
                    name: token.name as string | null,
                    email: token.email as string | null,
                    roles: token.roles as Role[] | undefined,
                };
            }
            return session;
        },
    },
};

export default authOption;