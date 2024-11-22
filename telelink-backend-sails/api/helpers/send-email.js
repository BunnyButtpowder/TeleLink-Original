const nodemailer = require('nodemailer');

module.exports = {
  friendlyName: 'Send email',

  description: 'Send an email using Nodemailer.',

  inputs: {
    to: {
      type: 'string',
      required: true,
      description: 'Email address of the recipient.',
    },
    subject: {
      type: 'string',
      required: true,
      description: 'Subject of the email.',
    },
    text: {
      type: 'string',
      required: true,
      description: 'Plain text body of the email.',
    },
  },

  fn: async function (inputs) {
    try {
      
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: 'trinhphuc980@gmail.com', 
          pass: 'kfqbavvazdgyysmd', 
        },
      });

     
      const mailOptions = {
        from: '"Support Team" trinhphuc980@gmail.com', 
        to: inputs.to,
        subject: inputs.subject,
        text: inputs.text, 
      };

     
      await transporter.sendMail(mailOptions);

      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw 'emailSendFailed';
    }
  },
};
