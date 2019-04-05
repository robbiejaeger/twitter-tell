require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');

function sendEmail() {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'jaeger.rob@gmail.com',
    from: 'lumphammer@twittertell.com',
    subject: 'New Lump Hammers Available',
    html: `<h1>Lump Hammer Alert</h1>
           <p>See if there are some new lump hammers available by Crucible Tools</p>
           <a href="https://twitter.com/RudeMechanic" target="_blank">Chris Schwarz Twitter</a>
           <a href="https://crucibletool.com/products/crucible-lump-hammer" target="_blank">Crucible Tool Lump Hammer</a>`
  };

  sgMail.send(msg);
}

function searchTweets() {
  const twitterHandle = 'RudeMechanic';
  const itemToSearch = 'Lump Hammer';

  fetch('https://www.google.com')
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

searchTweets();