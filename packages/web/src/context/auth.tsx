import React, { createContext, useContext } from 'react';
import {
  useMeQuery,
  useLogoutMutation,
  MeDocument,
  MeQuery,
  useLoginMutation
} from 'types/graphql';
import { useApolloClient } from 'react-apollo';

export type AuthContextType = {
  me: MeQuery['me'];
  login: (creds: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  logginIn: boolean;
};
const AuthContext = createContext<AuthContextType>({
  me: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
  logginIn: false
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const client = useApolloClient();

  const { data, loading } = useMeQuery();

  const [logoutMutation] = useLogoutMutation({
    refetchQueries: [{ query: MeDocument }],
    fetchPolicy: 'no-cache',
    awaitRefetchQueries: true
  });
  const [loginMutation, { loading: logginIn }] = useLoginMutation({
    refetchQueries: [{ query: MeDocument }],
    fetchPolicy: 'no-cache',
    awaitRefetchQueries: true
  });
  const login = async (creds: { username: string; password: string }) => {
    await loginMutation({ variables: creds });
  };
  const logout = async () => {
    await logoutMutation();
    await client.clearStore();
    await client.resetStore();
    await client.cache.reset();
  };
  const me = data?.me || null;
  return (
    <AuthContext.Provider value={{ me, login, logout, loading, logginIn }}>
      {loading ? <div>Loading</div> : children}
    </AuthContext.Provider>
  );
};
