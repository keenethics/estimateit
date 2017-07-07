import nodemailer from 'nodemailer';

const sendEmail = (emails, pdfBuffer) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'nazar.kukarkin@keenethics.com',
      pass: 'kee#eth!cs',
    },
  });

  const text = 'your file is attached';

  const mailOptions = {
    text,
    to: emails,
    subject: 'estimate',
    from: 'estimator@gmail.com',
    attachments: [{
      filename: 'filename.pdf',
      contentType: 'application/pdf',
      content: new Buffer(pdfBuffer, 'base64'),
    }],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.error(info);
    }
  });
};

export default sendEmail;
