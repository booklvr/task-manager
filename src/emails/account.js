const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'nick.a.dewaal@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    });
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'nick.a.dewaal@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}. Let me know what we can do differently.`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
};
