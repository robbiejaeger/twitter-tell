const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');

require('dotenv').config();

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
  const searchQuery = 'from:RudeMechanic lump hammers OR hammers';
  const sinceID = '1113872999055331328';

  const apiURL = 'https://api.twitter.com/1.1/search/tweets.json';
  const headers = new Headers({

  });

  fetch(`${apiURL}?q=${searchQuery}&since_id=${sinceID}`, {
      method: 'GET',
      headers: headers
    })
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

searchTweets();