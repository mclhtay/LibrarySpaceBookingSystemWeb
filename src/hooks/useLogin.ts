import users from '../assets/users.json';
import { User } from '../types';

export function useLogin(){  
  function validateAdmin(userEmail: string|undefined, userPassword: string|undefined): [boolean, User|null]{
    let valid = false;
    let user: User|null = null;
    if(!userEmail || !userPassword){
      return [valid, user];
    }
    for(const {email, password, firstName, lastName, isLibrarian} of users){
      if(isLibrarian){
        if(email === userEmail && password === userPassword){
          valid = true;
          user = {
            firstName,
            lastName,
            userId: email,
            isLibrarian,
            bookings: []
          }
          break;
        }
      }
    }
    return [valid, user];
  }

  function validateStudent(userEmail: string|undefined, userPassword: string|undefined): [boolean, User|null]{
    let valid = false;
    let user: User|null = null;
    if(!userEmail || !userPassword){
      return [valid, user];
    }
    for(const {email, password, firstName, lastName, isLibrarian} of users){
      if(!isLibrarian){
        if(email === userEmail && password === userPassword){
          valid = true;
          user = {
            firstName,
            lastName,
            userId: email,
            isLibrarian,
            bookings: []
          }
          break;
        }
      }
    }
    return [valid, user];
  }
  return [validateAdmin, validateStudent]
}