import { Booking } from '../types';

const BOOKING_STORAGE_KEY = Object.freeze("CS4474LibraryBookingKey");

export function useBookings(){
  function getStoredBookings(): Booking[]{
    const storedSpaces = localStorage.getItem(BOOKING_STORAGE_KEY);
    return storedSpaces ? JSON.parse(storedSpaces) : [];
  }
  function setStoredBookings(b: Booking[]): void{
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(b));
  }
  return [getStoredBookings, setStoredBookings];
}