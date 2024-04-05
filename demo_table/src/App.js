//this table fetches data from the endpoint and the display it inside the table and if any name is searched in search bar then info according to that specific name will be coming on the top  


import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

function createData(Name, Username, Zipcode) {
  return { Name, Username, Zipcode };
}

export default function BasicTable() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        const newData = data.map(user => createData(user.name, user.username, user.address.zipcode));
        setRows(newData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const filteredRows = rows.filter(row => {
    return row.Name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow style={{ background: 'blue' }}>
            <TableCell style={{ color: 'white' }}>
              <TextField
                id="outlined-search"
                label="Search"
                type="search"
                variant="outlined"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon />
                  ),
                }}
              />
            </TableCell>
            <TableCell align="right" style={{ color: 'white' }}>Name</TableCell>
            <TableCell align="right" style={{ color: 'white' }}>Username</TableCell>
            <TableCell align="right" style={{ color: 'white' }}>Zipcode</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell align="right">{row.Name}</TableCell>
              <TableCell align="right">{row.Username}</TableCell>
              <TableCell align="right">{row.Zipcode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
