
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
const AppServices = require('../appservices/appservices.model');
const { log } = require('console');
const Appointments = require('../appointments/appointments.model');
require('../clients/clients.model');
require('../services/services.model');
require('../employes/employes.model');
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


const getMailOptions = async() =>{
    let mailOptionsAll = [];

    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    console.log(tomorrow);
    const val = await Appointments.find({ date: tomorrow }).populate('clients').exec();
 
    if (val.length>0) {
        for(i=0;i<val.length;i++){
            const start =  val[i].starttime.hours+"h"+val[i].starttime.minutes+"min";
            console.log("start==>"+start);
            mailOptionsAll.push({  
                from: process.env.EMAIL_USER,
                to: 'tsikyrami123@gmail.com',
                subject: 'Rappel rendez vous Oasis Beauty',
                template: 'email',
                context: {
                    name: val[i].clients.name,
                    company: 'Oasis Beauty',
                    date : tomorrowFormatted,
                    starttime :start
                }
            });
        }
    }
    console.log("mailOptionsAll====>"+mailOptionsAll);
    return mailOptionsAll;
};

const sendmail = async() =>{
    let mailOptions = await getMailOptions();
    for(i=0;i<mailOptions.length;i++){
        await transporter.sendMail(mailOptions[i]);
    }
}
module.exports = {sendmail}