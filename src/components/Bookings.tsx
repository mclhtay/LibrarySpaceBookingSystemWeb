import React from 'react';
import { Booking } from '../types';

interface BookingsProps{
  bookings: Booking[],
  handleDeleteBooking: (b: number) => void
}

export function Bookings({bookings, handleDeleteBooking}: BookingsProps){
  return (
    <div>
      hi
    </div>
  )
}