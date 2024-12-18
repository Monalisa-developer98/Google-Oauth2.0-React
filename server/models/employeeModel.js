const mongoose = require('mongoose');
const validator = require('validator');

//schema
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        index: true
    }, 
    email: {
        type: String,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email. Please enter a valid email'
        },
        required: true,
        default: null,
        // unique: true,
        index: true 
    },
    empId: { type: String, default: null},
    googleId: { type: String, default: null},
    profilePicture: { type: String, default: null},
    phone: { type: String, default: null},
    password:{
        type: String,
        default: null
    },
    department: { type: String, default: null},
    designation: { type: String, default: null},
    address:{
        type: String, default: null
    },
    unit:{
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive : {
        type: Boolean,
        default: true,
    } ,
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: { type: Date }, 
    // login time otp
    otp: {
        type: String,
        default: null
    },
    otpAttempts: {
        type: Number,
        default: 0
    },
    otpExpiry:{
        type: Date
    }
},{
    timestamps: true
})

// model
const Employee = mongoose.model('momemployee', employeeSchema);

module.exports = Employee