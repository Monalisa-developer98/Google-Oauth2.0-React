const failResponse = (req, res, data, message, statusCode) =>{
    return res.status(statusCode).send({
        error: false,
        success: false,
        message: message,
        data
    })
}

const successResponse = (req, res, data, message, statusCode) =>{
    return res.status(statusCode).send({
        error: false,
        success: true,
        message: message,
        data
    })
}

// const errorResponse = (req, res, errorDesc, errorKey) =>{
//     const statusCode = errorKey ? errorKey : 500;
//     return res.status(statusCode).send({
//         error: true,
//         success: false,
//         message: errorDesc.message,
//         data: null
//     })
// }

const errorResponse = (req, res, errorDesc, errorKey = 500) => {
    const statusCode = errorKey || 500;
    const errorMessage = typeof errorDesc === 'string' ? errorDesc : errorDesc.message;

    return res.status(statusCode).send({
        error: true,
        success: false,
        message: errorMessage,
        data: null
    });
};

module.exports = {
    failResponse,
    successResponse,
    errorResponse
}