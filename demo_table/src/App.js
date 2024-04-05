///this table fetches data from the endpoint and the display it inside the table and if any name is searched in search bar then info according to that specific name will be coming on the top  
//If a row is selected then a modal will open displaying the email and address of that specific username which is selected 


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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function createData(Name, Username, Zipcode) {
  return { Name, Username, Zipcode };
}

export default function BasicTable() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
        const newData = data.map(user => createData(user.name, user.username, user.address.zipcode));
        setRows(newData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (selectedRow !== null) {
      // Fetch additional details for the selected user
      fetch(`https://jsonplaceholder.typicode.com/users?username=${selectedRow.Username}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            setUserDetails({
              email: data[0].email,
              address: data[0].address.street + ', ' + data[0].address.suite + ', ' + data[0].address.city
            });
          }
        })
        .catch(error => console.error('Error fetching user details:', error));
    }
  }, [selectedRow]);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setUserDetails(null); // Reset userDetails when modal is closed
  };

  const filteredRows = rows.filter(row => {
    return row.Name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
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
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} onClick={() => handleRowClick(row)}>
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
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User Details
          </Typography>
          {userDetails && (
            <div>
              <Typography>Email: {userDetails.email}</Typography>
              <Typography>Address: {userDetails.address}</Typography>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
