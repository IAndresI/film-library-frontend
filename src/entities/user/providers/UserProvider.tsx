import type { IUser } from '@/entities/user/model';

import { createContext, useContext } from 'react';

export const UserContext = createContext<IUser>(null!);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser должен использоваться внутри UserProvider');
  }

  return context;
};
