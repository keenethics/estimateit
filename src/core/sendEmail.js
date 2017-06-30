import nodemailer from 'nodemailer';

import generatePDF from './generatePDF';

const sendEmail = (emails, url) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'nazar.kukarkin@keenethics.com', // Your email id
      pass: 'kee#eth!cs' // Your password
    }
  });


  const text = `url = ${url}`;

  generatePDF(url);
  const mailOptions = {
      from: 'estimator@gmail.com', // sender address
      to: 'nazarkukarkin@gmail.com', // list of receivers
      subject: 'Email Example', // Subject line
      text: text //, // plaintext body
      // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };


  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log('----- here ----  errror ------');
          console.log(error);
          // res.json({yo: 'error'});
      }else{
          console.log('Message sent: ' + info.response);
          console.log(info);
          // res.json({yo: info.response});
      };
  });
};

export default sendEmail;
