import React, {useContext, useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Booking, Space } from '../types';
import { LoginContext, UserContext } from '../contexts';
import moment, { Moment } from 'moment';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import { Warning } from '@mui/icons-material';
import { DataTable } from './DataTable';
import { GridFooter, GridFooterContainer } from '@mui/x-data-grid';

interface AddBookingProps{
  open: boolean;
  handleAddBooking: (b: Booking) => void;
  handleClosePrompt: () => void;
  bookings: Booking[];
  spaces: Space[]
}

export function AddBooking({
  open, 
  handleAddBooking, 
  handleClosePrompt, 
  bookings,
  spaces
}:AddBookingProps){
  const [selectedSpace, setSelectedSpace] = useState<string|null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<Moment|null>(null);
  const [selectedStart, setSelectedStart] = useState<Moment|null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Moment|null>(null);
  const [generatedSlots, setGeneratedSlots] = useState<any[]|null>(null);
  const [timeHeaders, setTimeHeaders] = useState<string[]>([]);
  const [userEmailError, setUserEmailError] = useState<boolean>(false);
  const [firstConfirmed, setFirstConfirmed] = useState<boolean>(false);

  const [formFilters, setFormFilters] = useState<{[key: string]: string}>({
    'outlets': 'No',
    'media': 'No',
    'accessible': 'No',
    'quiet': 'No',
    'private': 'No'
  });
  const loginContext = useContext(LoginContext);
  const user = useContext(UserContext);

  useEffect(() => {
    if(spaces.length > 0){
      if(loginContext === 'Student'){
        setSelectedUser(user!.userId);
      }
    }
  }, [spaces, loginContext, user]);

  useEffect(() => {
    generateAvailabilityMatrix();
  }, [formFilters, selectedSeats, selectedDay, selectedEnd, selectedStart])
  
  useEffect(() => {
    if(firstConfirmed){
      setUserEmailError(!selectedUser || !validateEmail(selectedUser))
    }
  }, [selectedUser, firstConfirmed])

  function validateEmail(str: string){
    const regexExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regexExp.test(str);
  }

  function handleAddBookingClick(){
    if(!firstConfirmed){
      setFirstConfirmed(true);
    }
    if(!selectedUser || !validateEmail(selectedUser)){
      setUserEmailError(true);
      return;
    }
    const b: Booking = {
      bookingId: Date.now(),
      spaceId: parseInt(selectedSpace!, 10),
      userId: selectedUser,
      start: moment(selectedDay!.format("YYYY/MM/DD")).add(selectedStart!.get('hours'), 'hours').toDate(),
      end: moment(selectedDay!.format("YYYY/MM/DD")).add(selectedEnd!.get('hours'), 'hours').toDate(),
    }
    handleAddBooking(b);
    setGeneratedSlots(null);
    setSelectedDay(null);
    handleClosePrompt();
  }

  function handleCellClick({id}: any){
    const slots = generatedSlots?.find(slot => slot.id === id);
    for(const value of Object.values(slots)){
      if(value === false){
        setSelectedSpace(null);
        return;
      }
    }
    setSelectedSpace(id);
    
  }

  function generateAvailabilityMatrix(){
    setSelectedSpace(null);
    const spaceToTime: {[key: string]: boolean[]} = {};
    if(
      selectedDay === null || selectedStart === null || selectedEnd === null
      || selectedStart >= selectedEnd
    ){
      setGeneratedSlots(null);
      return;
    }
    const convertedFilters: {[key: string]: string} = Object.keys(formFilters).reduce((acc, n) => 
    ({...acc, [n]: formFilters[n] === 'Yes'}), {});
    const start = selectedStart.get('hour');
    const end = selectedEnd.get('hours') -1;
    outer:
    for(const space of spaces){
        for(const key of Object.keys(convertedFilters)){
          if(convertedFilters[key] && 
            /* @ts-ignore */
            !space.filters[key]){
              continue outer;
          }
        }
        if(space.seats < selectedSeats){
          continue;
        }
        spaceToTime[space.spaceId] = [];
        for(let i = moment(selectedDay.format("YYYY/MM/DD")).add(start, 'hours');
         i <= moment(selectedDay.format("YYYY/MM/DD")).add(end, 'hours'); i.add(1, 'hour')){
          spaceToTime[space.spaceId].push(!bookings.find(b => 
            /* @ts-ignore */
            b.start <= i &&b.end > i && b.spaceId === space.spaceId))
        }
    }
    const timeBasedHeaders: string [] = [];
    for(let i= start; i <= end; i ++){
      timeBasedHeaders.push(`${i%12 === 0 ? '12': i%12}${i >= 12 ? 'PM': 'AM'}`);
    }
    setGeneratedSlots(Object.keys(spaceToTime).map(
      spaceId =>{
        const r: any = {
          id: spaceId,
          Location: spaces.find(i => i.spaceId === parseInt(spaceId, 10))!.location,
        };
        for(let i = 0; i < timeBasedHeaders.length; i ++){
          r[timeBasedHeaders[i]] = spaceToTime[spaceId][i];
        }
        return r;
      }
    ));
    setTimeHeaders(timeBasedHeaders);
  }

  return (
    <Dialog open={open} fullWidth maxWidth='xl'>
      <DialogTitle>
        Book a new study space
      </DialogTitle>
      <DialogContent>
        {spaces.length === 0 ? 
          <Typography>Unfortunately there are no spaces available right now, please check again later.</Typography>
          :
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <Divider />
          </Grid>
          <Grid item sm={12} sx={{justifyContent: 'center'}}>
          <Grid container>
        {generatedSlots
        ? 
        <>
        <Grid item sm={12} justifyContent='center' display='flex'>
          <Typography>
            {selectedDay?.format('LL')}
          </Typography>
        </Grid>
        <Grid item sm={12}>
          <DataTable 
            headers={['Location', ...timeHeaders]}
            data={generatedSlots}
            convertBooleanToIcon
            customComponents={{
              Footer: () => (
                <GridFooterContainer>
                  <Typography sx={{marginLeft: '5px'}}>
                    *Note: make sure you really do need to book the entire duration!
                  </Typography>
                  <GridFooter sx={{border: 'none'}} />
                </GridFooterContainer>
              )
            }}
            handleCellClick={handleCellClick}
            countPerPage={Math.min(5, generatedSlots.length)}
          />
          </Grid>
        </>
      :
      <Grid item sm={12} justifyContent='center' display='flex'>
        <Warning color='warning' />
        <Typography>
          Some inputs are invalid, please adjust them to see available slots
        </Typography>
        </Grid>
        }
      </Grid>
          </Grid>
          <Grid item sm={12}>
            <Divider />   
          </Grid>
          <Grid container spacing={2} justifyContent="center">
          <Grid item sm={4} width="50%" sx={{ flexDirection: 'column', justifyContent: 'space-evenly'}}>
            <TextField 
              error={userEmailError}
              helperText={userEmailError ? 'User email is invalid': ''}
              fullWidth
              value={selectedUser}
              id="userId" name="userId"
              onChange={(e) => setSelectedUser(e.target.value)}
              variant='outlined' label="User Email" margin="normal"
              aria-readonly={loginContext === 'Student'}
              disabled={loginContext === 'Student'}
              />
            <FormControl fullWidth margin="normal">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker 
                  value={selectedStart}
                  label="Start hour"
                  onChange={(val) => 
                    {
                      if(val){
                        if(val.get('hours') < 9)
                          val.set('hours', 9);
                        if(val.get('hours') > 20){
                          val.set('hours', 20);
                        }
                      }
                      setSelectedStart(val)
                    }
                  }
                  minTime={moment("2018-01-01T09:00")}
                  maxTime={moment("2018-01-01T20:00")}
                  renderInput={(params) => <TextField {...params} />}
                  views={['hours']}
                />
              </LocalizationProvider>
            </FormControl>
            <TextField 
              value={selectedSeats}
              id="seats" name="seats"
              InputProps={{inputProps: {min: 1}}}
              onChange={(e) => setSelectedSeats(parseInt(e.target.value, 10))}
              fullWidth variant='outlined' label="Seats" type='number' margin="normal"/>
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
          <Grid item sm={4} width="50%">
            <FormControl fullWidth margin='normal'>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker 
                  minDate={moment()}
                  label="Day"
                  value={selectedDay}
                  onChange={(val) => setSelectedDay(val)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker 
                  value={selectedEnd}
                  label="End hour"
                  onChange={(val) => 
                    {
                      if(val){
                        if(val.get('hours') < 10)
                          val.set('hours', 10);
                        if(val.get('hours') > 21){
                          val.set('hours', 21)
                        }
                      }
                      setSelectedEnd(val)
                    }
                  }
                  minTime={moment("2018-01-01T10:00")}
                  maxTime={moment("2018-01-01T21:00")}
                  renderInput={(params) => <TextField {...params} />}
                  views={['hours']}
                />
              </LocalizationProvider>
            </FormControl>
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
          </Grid>
          <Grid item sm={12}>
            <Divider />
          </Grid>
        </Grid>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClosePrompt()}>
          Cancel
        </Button> 
      {spaces.length > 0 &&
        <Button 
          disabled={selectedSpace === null}
          variant="contained"
          onClick={handleAddBookingClick}
        >
          Confirm
        </Button> 
      }
      </DialogActions>
    </Dialog>
  )
}