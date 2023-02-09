import { AddCircle, Delete } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Switch, Toolbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { GridFooterContainer } from '@mui/x-data-grid';
import React, { useContext, useEffect, useState } from 'react';
import { LoginContext, UserContext } from '../contexts';
import { Booking, Space } from '../types';
import { AddBooking } from './AddBooking';
import { DataTable } from './DataTable';

interface BookingsProps{
  bookings: Booking[];
  spaces: Space[];
  handleDeleteBooking: (b: number) => void;
  handleAddBooking: (b: Booking) => void;
}

const UserBookingHeaders = [
  'Location',
  'Start',
  'End'
]

const AdminBookingHeaders = [
  'Location',
  'Start',
  'End',
  'User',
]

export function Bookings({bookings, spaces, handleDeleteBooking, handleAddBooking}: BookingsProps){
  const loginType = useContext(LoginContext);
  const user = useContext(UserContext);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [futureBookings, setFutureBookings] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<number|null>(null);
  const [showPastBookings, setShowPastBookings] = useState<boolean>(false);

  useEffect(() => {
    const b = loginType === 'Student'? bookings.filter(booking => booking.userId === user?.userId) : bookings;
    const allB: any[] = [];
    const futureB: any[] = [];

    for(const booking of b){
      const s = spaces.find(s => s.spaceId === booking.spaceId);
      
      const booked: {[key: string]: string|number|Date} = {
        'id': booking.bookingId,
        'Location': s ? s.location : 'Space deleted',
        'Start': `${booking.start.toLocaleDateString()} - ${booking.start.toLocaleTimeString()}`,
        'End': `${booking.end.toLocaleDateString()} - ${booking.end.toLocaleTimeString()}`,
      };
      if(loginType === 'Admin'){
        booked['User'] = booking.userId;
      }
      if(booking.start >= new Date()){
        futureB.push(booked);
      }
      allB.push(booked);
    }
    setAllBookings(allB);
    setFutureBookings(futureB);
  }, [bookings, loginType, user, spaces])

  function handleCellClick({id}: any){
    if(futureBookings.find(b => b.id === id)){
      setSelectedBooking(id);
    }else{
      setSelectedBooking(null);
    }
  }

  function handleDeleteIconClick(){
    setDeleteDialogOpen(true);
  }

  function handleAddIconClick(){
    setAddDialogOpen(true);
  }

  function handleShowPastBooking(){
    setShowPastBookings(!showPastBookings);
  }

  function BookingsHeader(){
    return (
      <Toolbar>
        <Typography variant='h6'>
          Confirmed Bookings
        </Typography>
        <IconButton onClick={() => handleAddIconClick()}>
          <AddCircle color='primary' />
        </IconButton>
      </Toolbar>
    )
  }

  function BookingsFooter(){
    return (
      <GridFooterContainer>
        <FormControlLabel 
          control={<Switch 
            sx={{marginLeft: '5px'}}
          checked={showPastBookings}
          onChange={() => handleShowPastBooking()}
        />}  label="Show past bookings"/>
        <IconButton
          onClick={() => handleDeleteIconClick()}
          disabled={selectedBooking === null}
        >
          <Delete />
        </IconButton>
      </GridFooterContainer>
    )
  }

  function BookingsNoRows(){
    return (
      <Stack height="100%" alignItems='center' justifyContent='center'>
        No upcoming bookings found, perhaps you want to book a new space?
      </Stack>
    )
  }

  return (
    <>
      <AddBooking
        open={addDialogOpen}
        handleAddBooking={handleAddBooking}
        handleClosePrompt={() => setAddDialogOpen(false)}
        bookings={bookings}
        spaces={spaces}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        >
        <DialogTitle>Are you sure you want to cancel this booking?</DialogTitle>
        <DialogContent>
          Once you cancel it, it might not be possible to re-book the same space.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {setDeleteDialogOpen(false); 
            handleDeleteBooking(selectedBooking!); setSelectedBooking(null)}}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <DataTable 
        headers={loginType === 'Student' ? UserBookingHeaders : AdminBookingHeaders}
        data={showPastBookings? allBookings : futureBookings}
        countPerPage={allBookings.length}
        customComponents={{
          Footer: BookingsFooter,
          Toolbar: BookingsHeader,
          NoRowsOverlay: BookingsNoRows
        }}
        handleCellClick={handleCellClick}
      />
    </>
  )
}