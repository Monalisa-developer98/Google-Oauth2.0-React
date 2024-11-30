const employeeService = require('../services/employeeService');
const Responses = require('../helpers/response');
const messages = require('../constants/constMessages');

/// create employee
const createEmployee = async (req, res) => {
    try {
        const { body, file } = req;
        const filePath = file?.path || null;

        const result = await employeeService.createEmployee(body, filePath);

        if (result?.emailNotVerified) {
            return Responses.failResponse(req, res, null, messages.emailNotVerified, 200);
        }
        
        if (result?.isDuplicateEmail) {
            return Responses.failResponse(req, res, null, messages.duplicateEmail, 200);
        }
        
        if (result?.success) {
            return Responses.successResponse(req, res, result.data, messages.createdSuccess, 201);
        }

        return Responses.failResponse(req, res, null, messages.creationFailed, 500);

    } catch (error) {
        console.error("Error in employee creation:", error);
        return Responses.errorResponse(req, res, error);
    }
};

// admin add employee
const addEmployee = async(req, res) => {
    try{
        const result = await employeeService.addEmployee(req.body);
        if(result?.isDuplicateEmail){
            return Responses.failResponse(req, res, null, messages.duplicateEmail, 200);
        }
        return Responses.successResponse(req, res, result, messages.employeeCreated, 201);
    } catch(error){
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
}

// list employee
const listEmployee = async(req, res) => {
    try{
        const result = await employeeService.listEmployee(req.query);
        if (result.totalCount === 0){
            return Responses.failResponse(req, res, null, messages.recordsNotFound, 200);
        }
        return Responses.successResponse(req, res, result, messages.recordsFound, 200);
    } catch(error){
        console.log(error);
        return Responses.errorResponse(req, res, error);
    }
}

const activateEmployee = async (req, res) => {
    try {
        const result = await employeeService.activateEmployee(req.params.empId);
        if (!result) {
            return Responses.failResponse(req, res, null, messages.recordsNotFound, 404);
        }

        return Responses.successResponse(req, res, result, messages.activateSuccess, 200);
    } catch (error) {
        console.error('Error activating employee:', error);
        return Responses.errorResponse(req, res, error);
    }
};

const deactivateEmployee = async (req, res) => {
    try {
        const result = await employeeService.deactivateEmployee(req.params.empId);
        if (!result) {
            return Responses.failResponse(req, res, null, messages.recordsNotFound, 404);
        }

        return Responses.successResponse(req, res, result, messages.deactivateSuccess, 200);
    } catch (error) {
        console.error('Error deactivating employee:', error);
        return Responses.errorResponse(req, res, error);
    }
};


module.exports = {
    createEmployee,
    addEmployee,
    listEmployee, activateEmployee, deactivateEmployee
}