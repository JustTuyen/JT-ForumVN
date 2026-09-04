import Sidebar from "../../component/Sidebar";
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
import { useSearchParams } from "react-router";
import SearchIcon from '@mui/icons-material/Search';
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
    const [newTitle, setNewTitle] = React.useState('');
    const [newDescription, setNewDescription] = React.useState('');
    const [newStatus, setNewStatus] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const openModal = (row) => {
        setSelectedRowId(row.id);
        setNewTitle(row.title ?? ''); 
        setNewDescription(row.description ?? ''); 
        setNewStatus(row.status ?? null);
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
                "title": newTitle,
                "description": newDescription,
                "status": newStatus

            });
            toast.success('Category updated successfully! please refresh the page.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            toast.error(`${error}!`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const [open1, setOpen1] = React.useState(false);
    const openModal1 = () => {
        setOpen1(true);
    };
    const closeModal1 = () => {
        setOpen1(false);
    };
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    const createCategory = async () => {
        try {
            await api.post(`/api/categories/`,{
                "title": title,
                "description": description,
                "status": 9
            });

            toast.success('Category created successfully! please refresh the page.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            toast.error(`${error}!`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };


    const [open2, setOpen2] = React.useState(false);
    const [id, setSelectedId] = React.useState(null);

    const openModal2 = (id) => {
        setOpen2(true);
        setSelectedId(id);
    };
    const closeModal2 = () => {
        setOpen2(false);
        setSelectedId(null)
    };

    const handleConfirmDelete= async () => {
        await deleteCategory(id);
        closeModal2();
    };
    
    const deleteCategory = async (id) => {
        console.log('Deleting category with ID:', id); // Debugging log
        try {
            await api.delete(`/api/categories/${id}/`);
            toast.success('Category deleted successfully! please refresh the page.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } catch (error) {
            toast.error(`${error}!`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [inputValue, setInputValue] = React.useState(query);
    const [ordering, setOrdering] = React.useState('-created_at');
    const [statusSelectValue, setStatusSelectValue] = React.useState('all');

    React.useEffect(() => {
        setInputValue(query);
    }, [query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
        setSearchParams({ q: inputValue.trim() });
        } else {
        setSearchParams({}); 
        }
    };


    const fetchCategories = React.useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (statusSelectValue && statusSelectValue !== 'all') {
                params.append('status', statusSelectValue);
            }
            params.append('ordering', ordering);

            let url = `/api/categories/`;
            if (query) {
                params.append('q', query);
                url = `/api/categories/searcher/`;
            }

            const { data } = await api.get(`${url}?${params.toString()}`);
            setCategories(data.results ?? data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching categories:', err);
            const msg = err.response?.data?.detail || 'Failed to fetch categories.';
            toast.error(msg, { position: 'top-right', autoClose: 3000 });
        }
    }, [query, ordering, statusSelectValue]);

    React.useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleStatusSelectChange = (newStatus) => {
        setStatusSelectValue(newStatus);
        fetchCategories(ordering, newStatus);
    };
    
    const handleSelectChange = (value) => {
        if (value.startsWith('status:')) {
            const statusId = value.split(':')[1];
            setStatusSelectValue(statusId);
        } else {
            setOrdering(value);
        }
    };

   



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
            case 'Active':
            case 'active':
                return 'success';

            case 'Suspend':
            case 'suspend':
                return 'error'; 

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
                    <div className="border-b-[#9400D3] border-b-2 pb-3 mb-3 flex flex-col gap-2">
                        <p className="dash-title">CATEGORY MANAGEMENT</p>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-2  items-center">
                            <div className="flex flex-row gap-2">
                                <Button variant="contained" color="secondary" onClick={openModal1}>
                                    New Category
                                </Button>
                               <select value={ordering} onChange={(e) => handleSelectChange(e.target.value)}>
                                    <option value="-title">A-Z</option>
                                    <option value="-created_at">New</option>
                                    <option value="-updated_at">Updated</option>
                                </select>
                                <select value={statusSelectValue} onChange={(e) => handleStatusSelectChange(e.target.value)}>
                                    <option value="all">All Statuses</option>
                                    <option value="9">On going</option>
                                    <option value="10">Suspended</option>
                                </select>
                            </div>
                            <div className="flex items-end md:justify-end">
                                <form action="" className="" onSubmit={handleSearchSubmit}>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Search..."
                                        className="border rounded-md px-2 py-1"
                                    />
                                    <IconButton aria-label="search" type="submit" 
                                    variant="outlined" color="secondary">
                                        <SearchIcon />
                                    </IconButton>
                                </form>
                            </div>

                        </div>
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
                                                <Button variant="outlined" onClick={() => openModal(row)}   
                                                 color="primary" size="small">
                                                    Edit
                                                </Button>
                                                <Button variant="outlined" color="error" 
                                                size="small" onClick={() => openModal2(row.id)}>
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
                            <input name="" id=""
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2 
                            border text-[#9400D3] border-[#9400D3]"
                            placeholder="Enter category title"
                            />
                            <textarea name="" id=""
                            //value={}
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2 
                            border text-[#9400D3] border-[#9400D3]"
                            placeholder="Enter category description">
                            </textarea>
                            <select value={newStatus} onChange={(e) => setNewStatus(parseInt(e.target.value))}>
                                <option value="9">Active</option>
                                <option value="10">Suspend</option>
                            </select>
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

        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={ open1}
            onClose={closeModal1}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
            <Fade in={open1}>
                <Box  sx={modalStyle2}>
                    <div className="flex justify-center
                    text-[24px] lg:text-[32px] text-[#9400D3] font-bold">
                        <p>Create Category</p>
                    </div>
                    <div className="p-2">
                        <div className="px-4 py-2 justify-center flex flex-col gap-2">
                            <input name="" id=""
                            
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2 
                            border text-[#9400D3] border-[#9400D3]"
                            placeholder="Enter category title"
                            />
                            <textarea name="" id=""
                            //value={}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full post-thread bg-white rounded-md px-3 py-2 
                            focus:outline-none focus:ring-2 
                            border text-[#9400D3] border-[#9400D3]"
                            placeholder="Enter category description">
                            </textarea>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal1}>
                                never mind
                            </Button>
                            <Button id="update-btn"
                            onClick={createCategory}
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>

         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={ open2}
            onClose={closeModal2}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
            backdrop: {
                timeout: 500,
            },
            }}
        >
            <Fade in={open2}>
                <Box  sx={modalStyle2}>
                    <div className="flex justify-center
                    text-[24px] lg:text-[32px] text-[#9400D3] font-bold">
                        <p>Delete Category</p>
                    </div>
                    <div className="p-2">
                        <div className="px-4 py-2 justify-center flex flex-col gap-2">
                            <p className="">You sure you want to delete this category?</p>
                            <p className="text-gray-50">Note that deleted categories cannot be recovered.</p>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button variant="outlined" color="error"  
                            onClick={closeModal2}>
                                never mind
                            </Button>
                            <Button id="update-btn"
                            onClick={handleConfirmDelete}
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

