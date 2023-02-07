import { createContext } from 'react';

export type LoginContextType = 'Student' | 'Admin' | null;
export const LoginContext = createContext<LoginContextType>(null);