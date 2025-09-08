import { createContext, useContext } from 'react';

export const AppContext = createContext();
export default AppContext;
export const useAppContext = () => useContext(AppContext);
