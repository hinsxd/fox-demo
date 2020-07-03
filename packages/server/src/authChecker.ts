import { AuthChecker } from 'type-graphql';
import { MyContext } from './types/Context';

export const authChecker: AuthChecker<MyContext> = (
  { root, args, context, info },
  roles
) => {
  return !!context.userId;
};
