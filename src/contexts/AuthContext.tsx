import { createContext } from "react";
import { User } from "../types";

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";


type AuthContextType = {
    user: User | undefined;
    signInWithGoogle:()=>Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode
}
  

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider({children}:AuthContextProviderProps){
  const [user, setUser] = useState<User>();

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user=>{
      if(user){
        const {displayName, photoURL,uid} = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account');
        }

        setUser({
          id:uid,
          name:displayName,
          avatar:photoURL 
        })
        }
    })

    return () =>{
      unsubscribe();
    }
  },[]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth,provider);
      
    if(result.user){
      const {displayName, photoURL,uid} = result.user;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account');
      }

      setUser({
        id:uid,
        name:displayName,
        avatar:photoURL 
      })
    }
  }
  
    return(
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {children}
        </AuthContext.Provider>
    )
}