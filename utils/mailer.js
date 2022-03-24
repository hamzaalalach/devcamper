const nodemailer = require('nodemailer');
const { mailer } = require('../config');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: mailer.SMTP_HOST,
    port: mailer.SMTP_PORT,
    auth: {
      user: mailer.SMTP_EMAIL,
      pass: mailer.SMTP_PASSWORD,
    },
  });

  const email = {
    from: `${mailer.FROM_NAME} <${mailer.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(email);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
