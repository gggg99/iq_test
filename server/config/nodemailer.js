const nodemailer = require('nodemailer');
const config = require('../config');

let transport = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user: config.googleAccount,
        pass: config.googlePassword
    }
});

const sendEmail = (message, address) => {
    return new Promise((resolve, reject) => {
        transport.sendMail({   
            from: 'shopservicestack@gmail.com',
            to: address,
            subject:'IQ Test',
            html: message
            },(err,info) => {
                if(err){console.log('error in delivering mail',err); reject(); }
                resolve(info);
                console.log(info);
            }
        );
    })
}

module.exports = {
    transporter:transport,
    sendEmail: sendEmail
}