import { useContext } from 'react';

import { UserContext } from '../../model/user.context';

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser должен использоваться внутри UserProvider');
  }

  return context;
};
