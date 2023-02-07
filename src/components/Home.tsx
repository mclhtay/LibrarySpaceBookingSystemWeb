import React, { useContext } from 'react';
import { LoginContext, UserContext } from '../contexts';

export function Home(){
  const loginContext = useContext(LoginContext);
  const userContext = useContext(UserContext);
  
  return (
    <div>
      Welcome {userContext?.firstName}, you are a {loginContext}
    </div>
  )
}