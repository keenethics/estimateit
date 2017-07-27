import nodemailer from 'nodemailer';

const sendEmail = ({ emails, attach, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'nazar.kukarkin@keenethics.com',
      pass: 'kee#eth!cs',
    },
  });

  const mailOptions = {
    text,
    to: emails,
    subject: 'estimate',
    from: 'estimator@gmail.com',
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
