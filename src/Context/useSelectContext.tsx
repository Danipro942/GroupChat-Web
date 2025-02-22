import { createContext, ReactNode, useState } from "react";
import { UserType } from "../types/user";

type Props = {
  children: ReactNode;
};

type SelectContextType = {
  userSelected?: UserType;
  setUserSelected: (data?: UserType) => void;
};

export const SelectContext = createContext<SelectContextType>(
  {} as SelectContextType
);

const SelectProvider = ({ children }: Props) => {
  const [userSelected, setUserSelected] = useState<UserType | undefined>(
    undefined
  );

  return (
    <SelectContext.Provider value={{ userSelected, setUserSelected }}>
      {children}
    </SelectContext.Provider>
  );
};

export default SelectProvider;
