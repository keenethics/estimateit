import Nightmare from 'nightmare';
import sendEmail from './sendEmail';

const generatePDF = (url, emails) => {
  let nightmare = Nightmare({
    show: false,
  });

  nightmare
    .goto(url)
    .wait(3000)
    .evaluate(() => {
      const body = document.querySelector('body');
      return { height: body.scrollHeight };
    })
    .wait(2000)
    .pdf({
      marginsType: 0,
      pageSize: 'A4',
      landscape: false,
      printBackground: true,
    })
    .then((pdfBuffer) => {
      sendEmail(emails, pdfBuffer);

      nightmare.end();
      nightmare.ended = true;
      nightmare = null;
    })
    .catch((err) => {
      console.error(err);
    });
};

export default generatePDF;
