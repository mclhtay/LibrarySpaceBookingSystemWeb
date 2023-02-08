import spaces from '../assets/spaces.json';
import { Space } from '../types';

const SPACE_STORAGE_KEY = Object.freeze("CS4474LibrarySpaceKey");

export function useSpaces(){
  function getStoredSpaces(): Space[]{
    const storedSpaces = localStorage.getItem(SPACE_STORAGE_KEY);
    return storedSpaces ? JSON.parse(storedSpaces) : spaces;
  }
  function setStoredSpaces(s: Space[]): void{
    localStorage.setItem(SPACE_STORAGE_KEY, JSON.stringify(s));
  }
  return [getStoredSpaces, setStoredSpaces];
}