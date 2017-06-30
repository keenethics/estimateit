import Nightmare from 'nightmare';

const generatePDF = (url) => {
  console.log(url);
  // let nightmare = Nightmare({
  //   show: false,
  // });
  // nightmare
  // .goto(url)
  //   .wait(2000)
  //   .evaluate(() => {
  //     const body = document.querySelector('body');
  //     return {
  //       height: body.scrollHeight,
  //     };
  //   })
  //   .pdf({
  //     printBackground: true,
  //     marginsType: 0,
  //     pageSize: 'A4',
  //     landscape: false,
  //   })
  //   .then((pdfBuffer) => {
  //     console.log('hello');
  //     console.log(pdfBuffer);
  //
  //     res.set('Content-Type', 'application/pdf');
  //     res.set('Content-Disposition: attachment; filename=filename.pdf');
  //     res.send(new Buffer(pdfBuffer, 'binary'));
  //     console.log('sent');
  //     nightmare.end();
  //     nightmare.ended = true;
  //     nightmare = null;
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
};

export default generatePDF;
