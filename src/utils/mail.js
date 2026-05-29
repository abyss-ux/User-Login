import nodemailer from "nodemailer";

const sendEmail = async(options) =>{
    const transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        port:process.env.MAIL_PORT,
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }, 
    });
    const mailOptions = {
        from: '"Auth Master" <noreply@auth.com>',
        to : options.email,
        subject : options.subject,
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Security Verification</h2>
                <p>${options.message}</p>
                <h1 style="color: #4f46e5;">${options.otp}</h1>
                <p>This code expires in 10 minutes.</p>
            </div>
        `,

    };
    await transporter.sendMail(mailOptions);

}

export {sendEmail}