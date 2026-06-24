import { apolloClient } from "@/lib/graphql/apollo";
import { LOGIN_MUTATION } from "@/lib/graphql/mutations/login";
import { REGISTER_MUTATION } from "@/lib/graphql/mutations/register";
import type { User } from "@/types/user";
import type { RegisterInput } from "@/types/register-input";
import type { LoginInput } from "@/types/login-input";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  signup: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<boolean>;
  logout: () => void;
};

type RegisterMutationData = {
  register: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type LoginMutationData = {
  login: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type AuthSession = {
  token: string;
  refreshToken: string;
  user: User;
};

const applyAuthSession = (
  set: (state: Partial<AuthState>) => void,
  session: AuthSession,
) => {
  set({
    user: session.user,
    token: session.token,
    refreshToken: session.refreshToken,
    isAuthenticated: true,
  });
};

const clearAuthSession = (set: (state: Partial<AuthState>) => void) => {
  set({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  });
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      signup: async (registerData: RegisterInput) => {
        try {
          const { data } = await apolloClient.mutate<
            RegisterMutationData,
            { data: RegisterInput }
          >({
            mutation: REGISTER_MUTATION,
            variables: {
              data: registerData,
            },
          });

          if (data?.register) {
            applyAuthSession(set, data.register);
            return true;
          }

          return false;
        } catch (error) {
          console.error("Erro ao fazer o cadastro", error);
          return false;
        }
      },
      login: async (loginData: LoginInput) => {
        try {
          const { data } = await apolloClient.mutate<
            LoginMutationData,
            { data: LoginInput }
          >({
            mutation: LOGIN_MUTATION,
            variables: {
              data: loginData,
            },
          });

          if (data?.login) {
            applyAuthSession(set, data.login);
            return true;
          }

          return false;
        } catch (error) {
          console.error("Erro ao fazer o login", error);
          return false;
        }
      },
      logout: () => {
        clearAuthSession(set);
        void apolloClient.clearStore();
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);