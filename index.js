const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/admin');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    // keys use to encrypt cookie, can put random string totally up to you.
    keys: ['thisKeyStringYouCanPustAnythingYouWant']
}));
app.use(authRouter);



app.listen(3000, () => {
    console.log('Listening');
});
