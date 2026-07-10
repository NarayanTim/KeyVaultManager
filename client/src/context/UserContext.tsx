// import { useAuthCallBack } from "@/hooks/authHook";
import { ReactNode, useState, useEffect, useCallback } from "react";
import type { User_T } from "@/@types/user.t";
import { UserContext } from "./helper/useAuth";
import { useAuth } from "@clerk/react";


const UserProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User_T | null>(null);

  const { isLoaded, isSignedIn } = useAuth();

  const { mutate, isPending, error } = {
    mutate: (() => {}),
    isPending: false,
    error: null,
  };


  const fetchUser = useCallback(() => {
    mutate(undefined, {
      onSuccess: (data) => {
        setUser(data ?? null);
      },
      onError: () => {
        setUser(null);
      },
    });
  }, [mutate]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    fetchUser();
  }, [isLoaded, isSignedIn, fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user: isSignedIn ? user : null,
        isLoading: !isLoaded || isPending,
        error,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;










// import { useAuthCallBack } from '@/hooks/authHook';
// import { ReactNode, useState, useEffect } from 'react';
// import type { User_T } from '@/@types/user.t';
// import { UserContext } from './helper/useAuth';
// import { useAuth } from '@clerk/react';

// const UserProvider = ({ children }: { children: ReactNode }) => {
//     const [user, setUser] = useState<User_T | null>(null);
//     const { isLoaded, isSignedIn } = useAuth();
//     const { mutate, isPending, error } = useAuthCallBack();

//   const fetchUser = () => {
//     mutate(undefined, {
//       onSuccess: (data) => setUser(data ?? null),
//       onError: () => setUser(null),
//     });
//   };


//   useEffect(() => {
//     // wait for Clerk to load, and skip the call entirely if signed out
//     if (!isLoaded) return;
//     if (!isSignedIn) {
//       return;
//     }
//     fetchUser();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoaded, isSignedIn]);

//   useEffect(() => {
//     if (!isLoaded) return;
//     if (!isSignedIn) {
//       setUser(null);
//     }
//   }, [isLoaded, isSignedIn]);

//   return (
//     <UserContext.Provider value={{ user, isLoading: isPending, error, refetchUser: fetchUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider
