const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create transporter
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    //secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'mostafa mohamed <mostafa.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html :
  };
  // 3) send the email
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
