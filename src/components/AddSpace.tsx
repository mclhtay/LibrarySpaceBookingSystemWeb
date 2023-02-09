import React,{ useEffect, useState } from 'react';
import {Space} from '../types';
import { 
  Button, Dialog, DialogContent, 
  DialogTitle, 
  Divider,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
 } from '@mui/material';

interface AddSpaceProps{
  open: boolean;
  spaceNames: string[];
  handleAddSpace: (s: Space) => void;
  handleClosePrompt: () => void;
}

export function AddSpace({
  open, handleAddSpace,
  spaceNames, handleClosePrompt
}: AddSpaceProps){

  const [formFilters, setFormFilters] = useState<{[key: string]: string}>({
    'outlets': 'No',
    'media': 'No',
    'accessible': 'No',
    'quiet': 'No',
    'private': 'No'
  });
  const [locationError, setLocationError] = useState<boolean>(false);

  function handleAddSpaceClick(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const location = data.get('location')!.toString();
    if(!location || spaceNames.includes(location)){
      setLocationError(true);
      return;
    }
    const seats = parseInt(data.get('seats')!.toString(), 10);
    const outlets = data.get('outlets')!.toString() === 'Yes';
    const media = data.get('media')!.toString() === 'Yes';
    const accessible = data.get('accessible')!.toString() === 'Yes';
    const quiet = data.get('quiet')!.toString() === 'Yes';
    const closed = data.get('private')!.toString() === 'Yes';
    handleAddSpace({
      spaceId: Date.now(),
      location,
      seats,
      filters: {
        outlets,
        media,
        accessible,
        quiet,
        "private": closed
      }
    })
    handleClosePrompt();
    setLocationError(false);
  }

  return(
    <Dialog open={open}>
      <DialogTitle>
        Add a new study space
      </DialogTitle>
      <DialogContent>
        <Divider />
        <Grid container spacing={2} component="form" onSubmit={handleAddSpaceClick}>
          <Grid item sm={12}>
            <TextField error={locationError}
              helperText={locationError ? "A location with this name already exist" : ""}
              name="location"
              id="location" fullWidth margin="normal" required variant='outlined' label="Location/Name"/>
          </Grid>
          <Grid item sm={6} width="50%" sx={{ flexDirection: 'column', justifyContent: 'space-evenly'}}>
            <TextField 
            InputProps={{inputProps: {min: 1}}}
            id="seats" name="seats" fullWidth required variant='outlined' label="Seats" type='number' margin="normal"/>
            <FormControl fullWidth margin='normal'>
              <InputLabel id="outlets-label">Outlets</InputLabel>
              <Select value={formFilters['outlets']}
                onChange={(e) => setFormFilters({...formFilters, 'outlets': e.target.value})}
                id="outlets"
                name="outlets" labelId='outlets-label' label="Outlets" fullWidth required variant='outlined'>
                <MenuItem value={'No'}>No</MenuItem>
                <MenuItem value={'Yes'}>Yes</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
              <InputLabel id="media-label">Media</InputLabel>
              <Select value={formFilters['media']}
                onChange={(e) => setFormFilters({...formFilters, 'media': e.target.value})}
                id="media"
                name="media" labelId='media-label' label="Media" fullWidth required variant='outlined'>
                <MenuItem value={'No'}>No</MenuItem>
                <MenuItem value={'Yes'}>Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6} width="50%">
            <FormControl fullWidth margin='normal'>
                <InputLabel id="accessible-label">Accessible</InputLabel>
                <Select value={formFilters['accessible']}
                  onChange={(e) => setFormFilters({...formFilters, 'accessible': e.target.value})}
                  id="accessible"
                  name="accessible" labelId='accessible-label' label="Accessible" fullWidth required variant='outlined'>
                  <MenuItem value={'No'}>No</MenuItem>
                  <MenuItem value={'Yes'}>Yes</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin='normal'>
                <InputLabel id="quiet-label">Quiet</InputLabel>
                <Select value={formFilters['quiet']}
                  onChange={(e) => setFormFilters({...formFilters, 'quiet': e.target.value})}
                  id="quiet"
                  name="quiet" labelId='quiet-label' label="Quiet" fullWidth required variant='outlined'>
                  <MenuItem value={'No'}>No</MenuItem>
                  <MenuItem value={'Yes'}>Yes</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin='normal'>
                <InputLabel id="private-label">Private spaces</InputLabel>
                <Select value={formFilters['private']}
                  onChange={(e) => setFormFilters({...formFilters, 'private': e.target.value})}
                  id="private"
                  name="private" labelId='private-label' label="Private spaces" fullWidth required variant='outlined'>
                  <MenuItem value={'No'}>No</MenuItem>
                  <MenuItem value={'Yes'}>Yes</MenuItem>
                </Select>
              </FormControl>
          </Grid>
          <Grid item sm={12}>
            <Divider />
          </Grid>
          <Grid item sm={12} sx={{display: 'flex', justifyContent: 'center'}}>
            <Button sx={{margin: '0 5px'}} onClick={() => handleClosePrompt()}>Cancel</Button>
            <Button sx={{margin: '0 5px'}} variant='contained' type='submit'>
              Confirm
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}