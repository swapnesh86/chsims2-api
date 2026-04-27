const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: "587",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const options = {
        from: sent_from,
        to: send_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    };

    // Send Email
    try {
        const info = await transporter.sendMail(options);
        console.log("Email sent:", info.messageId);
        return info; // Return info so the route can confirm success
    } catch (err) {
        console.error("Nodemailer Error:", err);
        throw err; // Re-throw so the route handler catches the 500 error
    }
    
    // transporter.sendMail(options, function (err, info) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(info);
    //     }
    // });
};

module.exports = sendEmail;
