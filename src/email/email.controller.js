const express = require("express");
const router = express.Router();
//const mailService = require("./email.services");
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
    }
});

const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./src/email/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/email/'),
};

transporter.use('compile', hbs(handlebarOptions))

router.post('/sendmail', async (req, res) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'tsikyrami123@gmail.com',
        subject: 'Welcome to My Company lol1',
        template: 'email',
        context: {
          name: 'lol',
          company: 'my company'
        }
      };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;