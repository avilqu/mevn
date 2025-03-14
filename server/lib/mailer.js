const nodemailer = require("nodemailer");
const User = require("../lib/init").mongoose.model("user");

const transport = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

const options = {
  name: process.env.MAILER_NAME,
  short: process.env.MAILER_NAME_SHORT,
  sender: process.env.MAILER_SENDER,
};

const header =
  "\
    <html>\
    <head>\
    <style>\
        .container {\
            max-width: 700px;\
            padding: 20px;\
            background-color: #222;\
            border: 1px solid #111;\
            border-radius: 5px;\
            color: #fff;\
        }\
        table {\
            border: 1px solid #ddd;\
            text-align: center;\
            width: 100%;\
        }\
        th, td {\
            padding: 15px;\
        }\
        h3 {color: #e74c3c;}\
        a, a:visited {\
            color: #00bc8c !important;\
        }\
    </style>\
    </head>\
    <body>\
    <h2>" +
  options.name +
  '</h2>\
    </br>\
    <div class="container">\
    ';

const footer =
  "\
    </div>\
    </body>\
    </html>\
";

const mailer = {
  newUser: async (args) => {
    const message =
      header +
      "\
        <h1>Welcome, " +
      args.name +
      "</h1>\
        <p>Your account on " +
      options.name +
      ' was just created. \
        <a href="http://' +
      args.baseUrl +
      "/user/" +
      args.id +
      "/password/" +
      args.token +
      '">\
        Follow this link</a> to generate your password.</p>\
        ' +
      footer;

    const response = await transport.sendMail({
      from: '"' + options.short + '" <' + options.sender + ">",
      to: args.email,
      subject: process.env.MAILER_SUBJECT_ACTIVATION,
      html: message,
    });
  },

  resetPassword: async (args) => {
    const message =
      header +
      '\
        <h1>Reset your password</h1>\
        <p>To create a new password, \
        <a href="http://' +
      args.baseUrl +
      "/user/" +
      args.id +
      "/password/" +
      args.token +
      "\">\
        follow this link</a>. If you didn't request \
        a password reset, ignore this email.</p>\
        " +
      footer;

    await transport.sendMail({
      from: '"' + options.short + '" <' + options.sender + ">",
      to: args.email,
      subject: process.env.MAILER_SUBJECT_PASSWORD_RESET,
      html: message,
    });
  },
};

module.exports = { mailer };
