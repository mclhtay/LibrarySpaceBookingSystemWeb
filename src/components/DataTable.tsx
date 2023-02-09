import { Cancel, Check } from '@mui/icons-material';
import { Grid, Skeleton } from '@mui/material';
import { DataGrid, GridColDef, GridSlotsComponent } from '@mui/x-data-grid';
import React from 'react';

interface Props {
  headers: string[];
  spacing?: number;
  loading?: boolean;
  convertBooleanToIcon?: boolean;
  countPerPage?: number;
  data: {[key:string]: any}[],
  widths?: number[],
  customComponents?: Partial<GridSlotsComponent>,
  handleCellClick: (e:any) => void
}

const TABLE_CELL_HEIGHT = 52;

const TABLE_BORDER_HEIGHT = 110;

export function DataTable(
  {
    headers,
    spacing,
    loading,
    countPerPage,
    data,
    widths,
    customComponents,
    handleCellClick,
    convertBooleanToIcon
  }: Props
){
  const formattedHeaders: GridColDef[] = React.useMemo(() => {
    return headers.map((header, i):GridColDef => {
      const h: {[key: string]: any} = {
        field: header,
        headerName: header,
        flex: widths? widths[i] : 150, 
      };
      if(convertBooleanToIcon && i > 0) {
        h['renderCell']= (params: any) => {
          return params.value? <Check color='success' /> : <Cancel color='error' />
        }
      }
      return h as (GridColDef);
    });
  }, [headers, widths, convertBooleanToIcon]);

  const formattedData = React.useMemo(() => {
    return data.map((d, i) => ({
      ...d,
    }));
  }, [data]);

  const TABLE_HEIGHT = TABLE_CELL_HEIGHT*((countPerPage!>15)?15:countPerPage!)+TABLE_BORDER_HEIGHT;

  return(
    (<Grid container spacing={spacing} 
      height={TABLE_HEIGHT}>
      {loading?
        headers.map(header => (
          <Grid key={header} item xs={12/headers.length}>
            <Skeleton variant='rectangular' height={TABLE_HEIGHT} />
          </Grid>
        )):
        <Grid item xs={12}>
          <DataGrid
            autoHeight
            columns={formattedHeaders}
            rows={formattedData}
            pageSize={countPerPage}
            rowsPerPageOptions={[countPerPage!]}
            components={customComponents}
            onCellClick={(e) => handleCellClick(e)}
            hideFooterSelectedRowCount
          />
        </Grid>
      }
    </Grid>)
  );
}

DataTable.defaultProps = {
  spacing:1,
  loading:false,
  countPerPage:10,
  widths: undefined,
  convertBooleanToIcon: false,
};