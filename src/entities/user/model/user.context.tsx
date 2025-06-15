import type { IUser } from '@/entities/user/model';

import { createContext } from 'react';

export const UserContext = createContext<IUser>(null!);
