import Nightmare from 'nightmare';
import sendEmail from './sendEmail';

const generatePDF = (cookies, url, emails) => {
  let nightmare = Nightmare({
    show: false,
  });

  nightmare
    .goto(url)
    .cookies.clear('connect.sid')
    .cookies.set({
      name: 'connect.sid',
      value: cookies['connect.sid'],
      path: '/',
    })
    .refresh()
    .goto(url)
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
