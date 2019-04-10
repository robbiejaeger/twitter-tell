const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');
const Nightmare = require('nightmare');

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
  // const searchQuery = 'from:RudeMechanic lump hammer OR hammers';
  const nightmare = Nightmare();

  nightmare
    .goto('https://twitter.com/RudeMechanic')
    .wait('#timeline')
    .evaluate(() => {
      const timelineTweets = [...document.querySelector('ol.stream-items').children];
      const tweetTexts = timelineTweets.map(tweet => {
        return tweet.querySelector('p.tweet-text').innerText;
      })

      const hammerTweets = tweetTexts.filter(text => {
        return text.toLowerCase().includes('lump')
      })

      return hammerTweets;
    })
    .end()
    .then(result => {
      console.log(result);
    })
    .catch(err => console.error(err));


  
}

searchTweets();