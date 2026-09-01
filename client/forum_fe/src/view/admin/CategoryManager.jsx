import Sidebar from "../../component/Sidebar";
import { useState } from "react";
import '../css/MCategory.css'
//
import Chip from '@mui/material/Chip';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { styled } from '@mui/material/styles';
import TableHead from '@mui/material/TableHead';
import api from '../../auth/ApiHandle';
import Button from "@mui/material/Button";
import {formatDate, modalStyle2} from '../user/profile/style/Modals'

import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import {toast, ToastContainer} from 'react-toastify'

//


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#9400D3',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(id, title, description, created_at, updated_at, status_name) {
  return { id, title, description, created_at, updated_at, status_name };
}

//
export default function CategoryManager(){
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isOpen, setIsOpen] = React.useState(true);
    const [rowId, setSelectedRowId] = React.useState(null);

    const [open, setOpen] = React.useState(false);
    const openModal = (rowId) => {
        setSelectedRowId(rowId);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
        setSelectedRowId(null);
    };

    const handleConfirmUpdate = async () => {
        await updateCategory(rowId);
        closeModal();
    };

    const updateCategory = async (id) => {
        try {
            await api.patch(`/api/categories/${id}/`,{
                "status": 19

            });
            toast.success('Category updated successfully!', {
                position: 'top-right',
                autoClose: 1000,
            });
        } catch (error) {
            toast.error(`${error}!`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };


    React.useEffect(() => {
        const load = async () => {
        try {
            const { data } = await api.get('/api/categories/');
            setCategories(data.results ?? data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
        };
        load();
    }, []);

    const rows = categories.map((cat, index) =>
        createData(
        cat.id ?? index,
        cat.title ?? cat.name ?? '',
        cat.description ?? '',
        cat.created_at ?? '',
        cat.updated_at ?? '',
        cat.status_name ?? '',
        )
    );

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const columns = [
        { id: 'title', label: 'Name', minWidth: 150, align: 'left' },
        { id: 'description', label: 'Description', minWidth: 200, align: 'left' },
        { id: 'general info', label: 'General Information', minWidth: 300, align: 'center' },
        { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
    ];

    const getStatusColor = (status) => {
        const statusName = typeof status === 'object' ? status?.name : status;

        switch (statusName?.toLowerCase()) {
            case 'active':
            case 'completed':
                return 'success'; // Green

            case 'pending':
            case 'process':
                return 'warning'; // Orange/Yellow

            case 'rejected':
                return 'error';   // Red

            default:
                return 'default'; // Gray
        }
    };

  if (loading) return <div className="p-8">Loading...</div>;
  
    return(
        <>
        <ToastContainer />
        <div className="h-screen flex bg-[#F3F5F7]">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <div className="flex-1 transition-all duration-300 px-3 h-full overflow-hidden">
                <div className="bg-white border-2 
                rounded-md border-[rgba(0,0,0,0.08)] 
                h-full p-6 shadow-sm flex flex-col">
                    <div className="border-b-[#9400D3] border-b-2 pb-3 mb-3">
                        <p className="dash-title">CATEGORY MANAGEMENT</p>
                    </div>
                    <div className="">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                <TableHead>
                                    <TableRow>
                                    {columns.map((column) => (
                                        <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                        >
                                        {column.label}
                                        </StyledTableCell>
                                    ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                    ).map((row) => (
                                    // Fixed: Removed inner nested <TableRow>
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.title}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.description}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <div className="flex flex-col gap-1 text-left">
                                                <div className="flex items-center gap-2">
                                                    <label htmlFor="" className="font-bold">Created:</label>
                                                    {row.created_at ? formatDate(row.created_at) : '-'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <label htmlFor="" className="font-bold">Updated:</label>
                                                    {row.updated_at ? formatDate(row.updated_at) : '-'}
                                                    </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <label htmlFor="" className="font-bold">Status:</label>
                                                    <Chip 
                                                        label={typeof row.status_name === 'object' ? 
                                                            row.status_name?.name : row.status_name} 
                                                        color={getStatusColor(row.status_name)} 
                                                        size="small" 
                                                        variant="outlined" 
                                                    />
                                                </div>
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <div className="flex flex-col gap-2">
                                                <Button variant="contained" onClick={() => openModal(row.id)}   
                                                 color="primary" size="small">
                                                    Edit
                                                </Button>
                                                <Button variant="contained" color="secondary" size="small">
                                                    Delete
                                                </Button>
                                            </div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={4} />
                                    </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        colSpan={4}
                                        count={rows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        slotProps={{
                                        select: { inputProps: { 'aria-label': 'rows per page' }, native: true },
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>





                    </div>
                </div>
            </div>    
        </div>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={closeModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
            <Fade in={open}>
                <Box  sx={modalStyle2}>
                    <div className="flex justify-center
                    text-[24px] lg:text-[32px] text-[#9400D3] font-bold">
                        <p>Update Category</p>
                    </div>
                    <div className="p-2">
                        <div className="px-4 py-2 justify-center flex flex-col gap-2">
                            <p>Are you sure you want to update this category?</p>
                            <select name="" id="" 
                            //value={violationType}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2
                            border text-[#9400D3] border-[#9400D3]"
                            //onChange={(e) => setViolationType(e.target.value)}
                            >
                                <option value="Spam" selected>Spam</option>
                                <option value="Hate, Abuse, or Harassment">Hate, Abuse, or Harassment</option>
                                
                            </select>
                            <textarea name="" id=""
                            //value={}
                            //onChange={(e) => setReason(e.target.value)}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2 
                            border text-[#9400D3] border-[#9400D3]"
                            placeholder="Please a reason if you want">
                            </textarea>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal}>
                                never mind
                            </Button>
                            <Button id="update-btn"
                            onClick={handleConfirmUpdate}
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
        </>
    )
}

