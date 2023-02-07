import { Booking } from './booking';

export interface User {
  userId: string;
  isLibrarian: boolean;
  firstName: string;
  lastName: string;
  bookings: Array<Booking>
}