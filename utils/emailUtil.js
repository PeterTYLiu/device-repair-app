const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
// const sgMail = require('@sendgrid/mail');

var transporter = nodemailer.createTransport(
  smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'reparrit@gmail.com',
      pass: 'reparritpassword',
    },
  })
);

const mailOptions = {
  from: 'reparrit@gmail.com',
  // to: 'sandy.boon@gmail.com',
  // subject: 'Sending Email using Node.js[nodemailer]',
  // text: 'That was easy!',
};

module.exports = function sendEmail({ to, subject, body }) {
  let sendMailOptions = {
    ...mailOptions,
    to: to,
    subject: subject,
    html: body,
  };
  transporter.sendMail(sendMailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   console.log(`API key is : ${process.env.SENDGRID_API_KEY}`)
//   const msg = {
//     to: 'test@example.com',
//     from: 'test@example.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   };
//   await sgMail.send(msg);
