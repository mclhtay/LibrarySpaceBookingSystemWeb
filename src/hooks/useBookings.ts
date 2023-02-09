import { Booking } from '../types';
import bookings from '../assets/bookings.json';

const BOOKING_STORAGE_KEY = Object.freeze("CS4474LibraryBookingKey");

export function useBookings(){
  function parseStoredBookings(bookings: any[]): Booking[]{
    for(const booking of bookings){
      booking['start'] = new Date(booking['start']);
      booking['end'] = new Date(booking['end']);
    }
    return bookings;
  }
  function getStoredBookings(): Booking[]{
    const storedBookings = localStorage.getItem(BOOKING_STORAGE_KEY);
    return storedBookings ? parseStoredBookings(JSON.parse(storedBookings)) : parseStoredBookings(bookings);
  }
  function setStoredBookings(b: Booking[]): void{
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(b));
  }
  return [getStoredBookings, setStoredBookings];
}