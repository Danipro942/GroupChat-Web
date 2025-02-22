import React, { createContext, ReactNode, useState } from "react";
import { UserType } from "../types/user";

type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType) => void;
};

type Props = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

const userProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default userProvider;
