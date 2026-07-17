import { Navigate } from "react-router-dom";
import { useUserAuth } from "@/context/helper/useUserAuth";
import { Skeleton } from "@/components/ui";

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { user, isLoading, isSignedIn, isLoaded } = useUserAuth();
    if (!isLoaded || isLoading) {
        // return <div>Loading...</div>;
        return <Skeleton/>
    }
    const isAuthenticated = isSignedIn && user;
    console.log(`${JSON.stringify(user, null ,2)} and ${isSignedIn}`);

    // if (!isSignedIn || !user) {
    //     console.log("Hello Fail With part")
    //     console.log(`Part A ${!isSignedIn} --- Part B ${!user} `)
    //     return <Navigate to="/" replace />;
    // }
    return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;

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