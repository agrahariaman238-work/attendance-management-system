const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            // let transporter = nodemailer.createTransport({
            //     host:process.env.MAIL_HOST,
            //     auth:{
            //         user: process.env.MAIL_USER,
            //         pass: process.env.MAIL_PASS,
            //     }
            // })

            console.log(process.env.MAIL_USER);
            console.log(process.env.MAIL_PASS.length);
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            });

            let info = await transporter.sendMail({
                // from: 'NSS NIT JAMSHEDPUR',
                from: process.env.MAIL_USER,
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender;