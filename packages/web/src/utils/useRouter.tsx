import { RouteComponentProps, __RouterContext } from 'react-router';
import { useContext } from 'react';

export const useRouter = <T extends {} = {}>(): RouteComponentProps<T> =>
  useContext(__RouterContext) as RouteComponentProps<T>;
