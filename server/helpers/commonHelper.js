const bcrypt = require('bcryptjs');
const saltRounds = 10;

// function to generate hash password
const generateHashPassword = async(normalPassword) =>{
    return bcrypt.hashSync(normalPassword, saltRounds);
}

// function to verify password
const verifyPassword = async(normalPassword, hashPassword) =>{
    return bcrypt.compareSync(normalPassword, hashPassword);
}

module.exports = {
    generateHashPassword,
    verifyPassword
}