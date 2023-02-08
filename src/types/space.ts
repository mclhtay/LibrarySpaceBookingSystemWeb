export interface Space {
  spaceId: number;
  seats: number;
  location: string;
  filters: {
    outlets: boolean,
    accessible: boolean,
    quiet: boolean,
    private: boolean,
    media: boolean
  }
}