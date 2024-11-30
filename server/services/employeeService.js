const Employee = require("../models/employeeModel");
const { generateHashPassword } = require('../helpers/commonHelper');
const OTP = require('../models/otpModel');
const ObjectId = require("mongoose").Types.ObjectId;

// verify active user
const verifyEmployee = async (empId) => {
    return await Employee.findOne(
      { _id: new ObjectId(empId), isActive: true },
      {
        _id: 1,
        email: 1,
        name: 1,
        isActive: 1,
      }
    );
};

// create Employee -- SignUp
const createEmployee = async (data, filePath) => {
  try {
      const otpRecord = await OTP.findOne({ email: data.email });
      if (!otpRecord || !otpRecord.isVerified) {
          return { emailNotVerified: true };
      }
      
      const emailDetails = await checkDuplicateEmail(data.email);
      if (emailDetails) {
          return { isDuplicateEmail: true };
      }

      const hashedPassword = await generateHashPassword(data.password);
      const inputData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          address: data.address,
          profilePicture: filePath || null,
          isVerified: true
      };

      const empData = new Employee(inputData);
      const result = await empData.save();
      
      return { success: true, data: result };

  } catch (error) {
      console.error("Error in employee creation:", error);
      return { error: true, message: error.message };
  }
};


const checkDuplicateEmail = async(email) =>{
  const employee = await Employee.findOne(
      { email, isActive:true },
      { _id: 1, email: 1, name: 1, isActive: 1 }
  );
  return employee;
}

// admin add employee
const addEmployee = async(data)=>{
  const emailDetails = await checkDuplicateEmail(data.email);
  if (emailDetails){
      return { isDuplicateEmail: true };
  }
  
  if (!emailDetails) {
      const inputData = {
          name: data.name,
          empId: data.empId,
          email: data.email,
          designation: data.designation,
          department: data.department,
          unit: data.unit
      }
      const employeeData = new Employee(inputData);
      const result = await employeeData.save();
      return result;
  }
  return false;
}

// list employee
const listEmployee = async (queryData) => {
  try {
      const { order = -1, searchKey } = queryData;

      let query = {};
      if (searchKey) {
          query.$or = [
              { name: { $regex: searchKey, $options: 'i' } },
              { designation: { $regex: searchKey, $options: "i" } },
          ];
      }

      const limit = queryData.limit ? parseInt(queryData.limit) : 10;
      const page = queryData.page ? parseInt(queryData.page) : 1;
      const skip = (page - 1) * limit;

      const totalCount = await Employee.countDocuments(query);
      const totalPages = Math.ceil(totalCount / limit);

      const employeeData = await Employee.find(query)
          .sort({ _id: parseInt(order) })
          .skip(skip)
          .limit(limit)
          .exec();

      return {
          currentPage: page,
          totalPages: totalPages,
          totalEmployees: totalCount,
          employeeData: employeeData,
      };
  } catch (error) {
      console.error('Error listing employees:', error);
      throw new Error('Error listing employees');
  }
};

// activate employee
const activateEmployee = async (empId) => {
  const result = await Employee.findOneAndUpdate(
      { _id: new ObjectId(empId) },
      { $set: { isActive: true } },
      { new: true }
  );
  return result;
};

// deactivate employee
const deactivateEmployee = async (empId) => {
  const result = await Employee.findOneAndUpdate(
    { _id: new ObjectId(empId) },
      { $set: { isActive: false } },
      { new: true } 
  );
  return result;
};


module.exports = {
    verifyEmployee,
    createEmployee,
    addEmployee,
    listEmployee,
    activateEmployee,
    deactivateEmployee
}