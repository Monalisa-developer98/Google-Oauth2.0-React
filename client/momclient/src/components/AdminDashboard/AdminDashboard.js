import React, {useState, useEffect} from 'react';
import { Box, CssBaseline, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Grid } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import './AdminDashboard.css';
import { validateField } from '../../validation/validate';
import { toast} from 'react-toastify';
import { Switch } from '@mui/material';
import { addEmployee, listEmployee, deactivateEmployee, activateEmployee  } from '../../utils/api';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

const AdminDashboard = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    empId: '',
    email: '',
    designation: '',
    department: '',
    unit: '',
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [pageSize] = useState(2); // Number of employees per page

 // Fetch employees on component mount
 useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await listEmployee({ searchKey: searchQuery, page: currentPage, limit: pageSize });
        const { employeeData, totalEmployees } = response.data || {};
        setEmployees(employeeData || []);
        setTotalEmployees(totalEmployees || 0);
    } catch (error) {
      toast.error('Failed to load employees');
    }
  };

  fetchEmployees();
}, [currentPage, searchQuery, pageSize]);

const handlePageChange = (page) => {
  setCurrentPage(page);
};

// handle form value changes
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
  handleValidation(name, value);
}

const handleValidation = (field, value) => {
  const error = validateField(field, value, touched[field]);
  setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
};


const handleSubmit = async (e) => {
  e.preventDefault();
  // console.log('Form Submitted:', formValues)

  // Mark all fields as touched
    const touchedFields = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(touchedFields);

    // Validate all fields
    Object.keys(formValues).forEach((field) => {
      handleValidation(field, formValues[field]);
    });

    // Check if there are any validation errors
  const hasErrors = Object.keys(errors).some((key) => errors[key]);
  const allFieldsFilled = Object.keys(formValues).every((key) => formValues[key]);

  if (!hasErrors && allFieldsFilled ){
    setIsLoading(true);

    setTimeout(async () => {
    try {
      const response = await addEmployee(formValues);
      toast.success(response.message);

      // Reset form values
      setFormValues({
        name: "",
        empId: "",
        email: "",
        designation: "",
        department: "",
        unit: "",
      });
      setErrors({});
      setTouched({});

      // Refresh employee list
      const { data } = await listEmployee({ searchKey: searchQuery, page: currentPage, limit: pageSize });
      setEmployees(data.employeeData);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false); // Stop loading
    }
  }, 1000);
  }
}


const handleToggle = async (employeeId, isActive) => {
  try {
    let response;
    if (isActive) {
      response = await deactivateEmployee(employeeId); 
    } else {
      response = await activateEmployee(employeeId);
    }
    if (response.success) {
      toast.success(response.message);

      // Update the local state
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === employeeId
            ? { ...employee, isActive: !isActive }
            : employee
        )
      );
    } else {
      toast.error(response.message || 'Failed to update status');
    }
  } catch (error) {
    toast.error(error.message || 'Error updating status');
  }
};


  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar />
        {/* <Sidebar /> */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Add Employee
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Employee Name"
                  variant="outlined"
                  placeholder="Enter Employee Name"
                  value={formValues.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="empId"
                  name="empId"
                  label="Employee ID"
                  variant="outlined"
                  placeholder="Enter Employee ID"
                  value={formValues.empId}
                  onChange={handleChange}
                  error={!!errors.empId}
                  helperText={errors.empId}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  placeholder="Enter Email"
                  value={formValues.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="designation-label">Designation</InputLabel>
                  <Select
                    labelId="designation-label"
                    id="designation"
                    name="designation"
                    label="Designation"
                    value={formValues.designation}
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Select Designation</em>
                    </MenuItem>
                    <MenuItem value="Developer">Developer</MenuItem>
                    <MenuItem value="Designer">Designer</MenuItem>
                    <MenuItem value="Digital Marketer">Digital Marketer</MenuItem>
                  </Select>
                  {errors.designation && <Typography variant="caption" color="error">{errors.designation}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    name="department"
                    label="Department"
                    value={formValues.department}
                    onChange={handleChange}
                    error={!!errors.department}
                    helperText={errors.department}
                  >
                    <MenuItem value="">
                      <em>Select Department</em>
                    </MenuItem>
                    <MenuItem value="IT">IT</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                  </Select>
                  {errors.department && <Typography variant="caption" color="error">{errors.department}</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="unit-label">Unit</InputLabel>
                  <Select
                    labelId="unit-label"
                    id="unit"
                    name="unit"
                    label="Unit"
                    value={formValues.unit}
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Select Unit</em>
                    </MenuItem>
                    <MenuItem value="East">East</MenuItem>
                    <MenuItem value="West">West</MenuItem>
                    <MenuItem value="North">North</MenuItem>
                  </Select>
                  {errors.unit && <Typography variant="caption" color="error">{errors.unit}</Typography>}
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </form>

          <div className="employee-list-container mt-5">
          <Typography variant="h4" gutterBottom >
             Employee List
          </Typography>
            <div className="tbl-text-search">
            <div className="search-box">
            <input 
              type="search" 
              placeholder="Search By Employee" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#4F2CC8"
              viewBox="0 0 16 16"
              className="search-icon"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path>
            </svg>
          </div>

            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              { employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.empId || employee._id}>
                    <td>{employee.name || 'N/A'}</td>
                    <td>{employee.empId || 'N/A'}</td>
                    <td>{employee.designation || 'N/A'}</td>
                    <td>{employee.department || 'N/A'}</td>
                    <td>{employee.unit || 'N/A'}</td>
                    <td><Switch
      checked={employee.isActive}
      onChange={() => handleToggle(employee._id, employee.isActive)}
      color="primary"
    /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    {employees.length === 0 ? 'Loading employees...' : 'No employees found.'}
                  </td>
                </tr>
              )}

              </tbody>
            </table>
            
          </div>
          {totalEmployees > pageSize && (
            <Pagination
              current={currentPage}
              total={totalEmployees }
              pageSize={pageSize}
              onChange={handlePageChange}
              style={{ textAlign: 'center', marginTop: '20px' }}
            />
          )}
        </Box>
      </Box>
      
    </>
  );
};

export default AdminDashboard;