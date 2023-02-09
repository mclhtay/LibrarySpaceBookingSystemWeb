import React, { useContext, useState } from 'react';
import { LoginContext} from '../contexts';
import logo from '../assets/logo.svg';
import {
  Grid,  Box, CssBaseline, 
  AppBar,
  Toolbar, IconButton, Button, Alert
 } from '@mui/material';
import {Logout} from '@mui/icons-material';
import { Booking, Space } from '../types';
import { Spaces } from './Spaces';
import { useSpaces } from '../hooks/useSpaces';
import { useBookings } from '../hooks';
import { Bookings } from './Bookings';

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
  const [viewSelection, setViewSelection] = useState<ViewSelection>('Booking');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allSpaces, setAllSpaces] = useState<Space[]>([]);
  const [getStoredSpaces, setStoredSpaces] = useSpaces();
  const [getStoredBookings, setStoredBookings] = useBookings();
  const [newSpaceAlert, setNewSpaceAlert] = useState<boolean>(false);
  const [newBookingAlert, setNewBookingAlert] = useState<boolean>(false);

  React.useEffect(() => {
    /* @ts-ignore */
    const b: Booking[] = getStoredBookings();
    /* @ts-ignore */
    const s: Space[] = getStoredSpaces();
    setAllBookings(b);
    setAllSpaces(s);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setNewSpaceAlert(false);
      setNewBookingAlert(false);
    }, 3000);
    return () => {clearTimeout(timer)};
  }, [newSpaceAlert, newBookingAlert])

  function handleViewSelectionChange(e: any){
    setViewSelection(e.target.id);
  }

  function handleDeleteSpace(id: number){
    const s = allSpaces.filter(s => s.spaceId !== id);
    setAllSpaces(s);
    setStoredSpaces(s);
  }

  function handleAddSpace(space: Space){
    const s = [...allSpaces];
    s.push(space);
    setAllSpaces(s);
    setStoredSpaces(s);
    setNewSpaceAlert(true);
  }

  function handleAddBooking(booking: Booking){
    const b = [...allBookings];
    b.push(booking);
    setAllBookings(b);
    setStoredBookings(b);
    setNewBookingAlert(true);
  }

  function handleDeleteBooking(id: number){
    const b = allBookings.filter(b => b.bookingId !== id);
    setAllBookings(b);
    setStoredBookings(b);
  }

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <AppBar color="transparent">
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
        {newSpaceAlert && <Alert sx={{width: '50%', marginBottom: '5px'}} severity='success' onClose={() => setNewSpaceAlert(false)}>
          New study space added!
        </Alert>}
        {newBookingAlert && <Alert sx={{width: '50%', marginBottom: '5px'}} severity='success' onClose={() => setNewBookingAlert(false)}>
          New study space booked!
        </Alert>}
        <Grid container>
          {
            viewSelection === 'Booking' ?
            <Bookings 
              bookings={allBookings}
              spaces={allSpaces}
              handleAddBooking={handleAddBooking}
              handleDeleteBooking={handleDeleteBooking}
            />
            :
            <Spaces 
              spaces={allSpaces}
              handleDeleteSpace={handleDeleteSpace}
              handleAddSpace={handleAddSpace}
            />
          }
        </Grid>
      </Box>
    </Box>
  )
}