import React, {useState} from 'react';

import { LoginContext, LoginContextType } from './contexts/LoginContext';
import {Grid} from '@mui/material';
import { Login } from './components';
import { User } from './types';
import { UserContext } from './contexts';
import { Home } from './components/Home';

function App() {
  const [userLoginContext, setUserLoginContext] = useState<LoginContextType>(null);
  const [loggedInUser, setLoggedInUser] = useState<User|null>(null);

  return (
    <>
      {
        userLoginContext? 
        <LoginContext.Provider value={userLoginContext}>
            <UserContext.Provider value={loggedInUser}>
              <Home />
            </UserContext.Provider>
          </LoginContext.Provider>
        :
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '90vh' }}
        >
          <Grid item xs={3}>
            <Login 
              setUserLoginContext={setUserLoginContext}
              setLoggedInUser={setLoggedInUser}
            />
          </Grid>   
        </Grid>         
      }

    </>
  );
}

export default App;
