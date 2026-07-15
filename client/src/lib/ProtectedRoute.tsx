import { Navigate } from "react-router-dom";
import { useUserAuth } from "@/context/helper/useUserAuth";

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { user, isLoading, isSignedIn } = useUserAuth();
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn || !user) {
        console.log("Hello")
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;






// import React, { ReactNode } from 'react'
// import { Navigate } from "react-router-dom";


// export interface RouterTypes{
//   user: User_T;
//   isSignedIn: boolean;
//   isLoading: boolean;
// }

// const ProtectedRoute = (children:ReactNode, {user, isSignedIn,isLoading}:RouterTypes) => {

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (!isSignedIn || !user) {
//         return <Navigate to="/" replace />;
//     }

//   return <>{children}</>;
// }

// export default ProtectedRoute