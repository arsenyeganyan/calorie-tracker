const nodemailer = require('nodemailer');

async function sendMail(text, email) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'kerparvest69@gmail.com',
            pass: 'qkvv jlus yaux vpfv '
        }
    });

    const mailOptions = {
        from: 'kerparvest69@gmail.com',
        to: email,
        subject: 'Email confirmation',
        text: text
    }
    
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: ', info.messageId);
}

module.exports = sendMail;