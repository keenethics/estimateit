import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

if (!process.env.MAIL_API_KEY) console.log('WARNING! PLEASE, PROVIDE VALID <MAIL_API_KEY> AS NODE ENVIRONMENT VARIABLE');

const sendEmail = ({ emails, attach, text }) => {
  const transporter = nodemailer.createTransport(mg({
    auth: {
      api_key: process.env.MAIL_API_KEY,
      domain: 'keenethics.com',
    },
  }));

  const mailOptions = {
    text,
    to: emails,
    subject: 'estimate',
    from: 'estimator@keenethics.com',
  };

  if (attach) {
    mailOptions.attachments = [{
      filename: 'filename.pdf',
      contentType: 'application/pdf',
      content: new Buffer(attach, 'base64'),
    }];
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.error(info);
    }
  });
};

export default sendEmail;
