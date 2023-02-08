import React,{ useState } from 'react';
import { DataTable } from './DataTable';
import {Space} from '../types';
import { GridFooter, GridFooterContainer } from '@mui/x-data-grid';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  DialogTitle, IconButton, Toolbar, Typography,
  Stack
 } from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';

interface SpacesProps {
  spaces: Space[]
  handleDeleteSpace: (s: number) => void
}

const SpaceHeaders = [
  'Location',
  'Seats',
  'Outlets',
  'Accessible',
  'Quiet',
  'Private',
  'Media',
];

export function Spaces({spaces, handleDeleteSpace}: SpacesProps){
  const [allSpaces, setAllSpaces] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedSpace, setSelectedSpace] = useState<number|null>(null);

  React.useEffect(() => {
    const booleanToString = (b: boolean) => b ? 'Yes' : 'No';
    const s: any[] = []
    for(const space of spaces){
      s.push({
        'id': space.spaceId,
        'Location': space.location,
        'Seats': space.seats,
        'Outlets': booleanToString(space.filters.outlets),
        'Accessible': booleanToString(space.filters.accessible),
        'Quiet': booleanToString(space.filters.quiet),
        'Private': booleanToString(space.filters.private),
        'Media': booleanToString(space.filters.media)
      })
    }
    setAllSpaces(s);
  }, [spaces]);

  function handleCellClick({id}:any){
    setSelectedSpace(id);
  }

  function handleDeleteIconClick(){
    setDeleteDialogOpen(true)
  }

  function SpacesHeader(){
    return (
      <Toolbar>
        <Typography variant='h6'>
          All spaces
        </Typography>
        <IconButton>
          <AddCircle color='primary' />
        </IconButton>
      </Toolbar>
    )
  }

  function SpacesFooter(){
    return(
      <GridFooterContainer>
          <IconButton 
            onClick={() => handleDeleteIconClick()}
            disabled={selectedSpace === null}>
            <Delete />
          </IconButton>
        <GridFooter sx={{border: 'none'}} />
      </GridFooterContainer>
    )
  }

  function SpacesNoRows() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        No spaces found, perhaps you want to add a space?
      </Stack>
    )
  }

  return (
    <>
    <Dialog 
      open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogTitle>Are you sure you want to delete this space?</DialogTitle>
      <DialogContent>
        {allSpaces.find(s => s.id === selectedSpace)?.Location}
        {" "}
        will be deleted. This cannot be undone!
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        <Button 
         onClick={() => {setDeleteDialogOpen(false); 
         handleDeleteSpace(selectedSpace!); setSelectedSpace(null)}}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
      <DataTable 
        headers={SpaceHeaders}
        data={allSpaces}
        countPerPage={allSpaces.length}
        customComponents={{
          Footer: SpacesFooter,
          Toolbar: SpacesHeader,
          NoRowsOverlay: SpacesNoRows,
        }}
        handleCellClick={handleCellClick}
      />
    </>
  )
}