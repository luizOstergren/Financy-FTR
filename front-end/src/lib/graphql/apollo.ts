import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import {ErrorLink} from "@apollo/client/link/error"
import {CombinedGraphQLErrors} from "@apollo/client/errors"
import { SetContextLink } from "@apollo/client/link/context"
import { useAuthStore } from "@/stores/auth";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL,
});

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const hasAuthError = error.errors.some(
      (err) =>
        err.message === 'Not authenticated' ||
        err.extensions?.code === 'UNAUTHENTICATED',
    )
    if (hasAuthError) {
      useAuthStore.getState().logout()
    }
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});