const nodemailer = require("nodemailer");

module.exports = async (params) => {
  try {
    var transport = nodemailer.createTransport({
      host: process.env.host,
      port: process.env.port,
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    const mailOption = {
      from: process.env.SUPPORT_EMAIL,
      to: params.email,
      subject: params.subject,
      html: params.html,
    };

    transport.sendMail(mailOption, (error, info) => {
      if (error) {
        return {
          status: false,
          message: "Error in send mail.",
        };
      }
      return { status: true };
    });
  } catch (error) {
    return {
      status: false,
      message: "Error in send mail.",
    };
  }
};
