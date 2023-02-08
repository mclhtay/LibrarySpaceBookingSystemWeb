import React, { useContext, useState } from 'react';
import { LoginContext, UserContext} from '../contexts';
import logo from '../assets/logo.svg';
import {
  Grid,  Box, CssBaseline, 
  AppBar,
  Toolbar, IconButton, Button
 } from '@mui/material';
import {Logout} from '@mui/icons-material';
import { Booking, Space } from '../types';
import { Spaces } from './Spaces';
import { useSpaces } from '../hooks/useSpaces';
import { useBookings } from '../hooks';

type ViewSelection = 'Booking' | 'Space';

const ButtonLabels = Object.freeze({
  'Booking': {
    'Student': 'View my bookings',
    'Admin': 'View all bookings'
  },
  'Space': {
    'Student': '',
    'Admin': 'View all spaces'
  }
})

export function Home(){
  const loginContext = useContext(LoginContext);
  const userContext = useContext(UserContext);
  const [viewSelection, setViewSelection] = useState<ViewSelection>('Booking');
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allSpaces, setAllSpaces] = useState<Space[]>([]);
  const [getStoredSpaces, setStoredSpaces] = useSpaces();
  const [getStoredBookings, setStoredBookings] = useBookings();

  React.useEffect(() => {
    /* @ts-ignore */
    const b: Booking[] = getStoredBookings();
    /* @ts-ignore */
    const s: Space[] = getStoredSpaces();
    setAllBookings(b);
    setAllSpaces(s);
    if(loginContext === 'Student'){
      handleSetUserBookings();
    }
  }, []);

  function handleSetUserBookings(){
    const b: Booking[] = allBookings.filter((b: Booking) =>  b.userId === userContext!.userId);
    setUserBookings(b);
  }

  function handleViewSelectionChange(e: any){
    setViewSelection(e.target.id);
  }

  function handleDeleteSpace(id: number){
    const s = allSpaces.filter(s => s.spaceId !== id);
    setAllSpaces(s);
    setStoredSpaces(s);
  }

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <AppBar  color="transparent">
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Grid item>
            <img height="30px" src={logo} alt="Western Library Logo" />
          </Grid>
          <IconButton onClick={() => window.location.reload() }>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component='main' sx={{p:3, width: "100%"}} >
        <Toolbar />
        <Grid container spacing={2}>
          <Grid item>
            <Button 
              id='Booking'
              onClick={(e) => handleViewSelectionChange(e)}
              variant={viewSelection === 'Booking' ? 'contained' : 'outlined'}>
              {ButtonLabels['Booking'][loginContext!]}
            </Button>
            </Grid>
            { loginContext === 'Admin' && 
              <Grid item>
                <Button 
                  id='Space'
                  onClick={(e) => handleViewSelectionChange(e)}
                  variant={viewSelection === 'Space' ? 'contained' : 'outlined'}>
                  {ButtonLabels['Space'][loginContext!]}
                </Button>
              </Grid>
            }
        </Grid>
        <Toolbar />
        <Grid container>
          {
            viewSelection === 'Booking' ?
            <>hi</> :
            <Spaces 
              spaces={allSpaces}
              handleDeleteSpace={handleDeleteSpace}
            />
          }
        </Grid>
      </Box>
    </Box>
  )
}