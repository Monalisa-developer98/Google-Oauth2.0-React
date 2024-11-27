const { transporter, mailOptions } = require('../emailSetUp/mailSetUp');

const sendMail = async(email, emailSubject, mailData) => {
    const mailOptionsInfo = {
        from: mailOptions,
        to: email,
        subject: emailSubject,
        html: mailData
    };

    const isSuccess = await transporter.sendMail(mailOptionsInfo);
    return isSuccess;
};

module.exports = {
    sendMail
};