const nodemailer = require('nodemailer');

async function sendEmail(address, password) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.TEST_EMAIL,
      pass: process.env.TEST_PASSWORD
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.TEST_EMAIL, // sender address
    to: `${address}`, // list of receivers
    subject: "Successfully Signed up on Ezulu", // Subject line
    text: "You have successfull signed up on Ezulu", // plain text body
    html: `<p>Here is your password: <strong>${password}</strong>. Keep it safe!</p>`, // html body
  });

  //console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail




