import { createContext, useContext } from "react";
import type { User } from "@/@types/user.t";


export interface UserContextType {
    user: User | null;
    isLoading: boolean;
    isSignedIn: boolean;
    refetch?: () => void;
    isLoaded:boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserAuth = () => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return ctx;
};