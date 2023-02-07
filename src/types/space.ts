export interface Space {
  spaceId: string;
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