const sgMail = require('@sendgrid/mail');
const puppeteer = require('puppeteer');

require('dotenv').config();

function sendFoundEmail() {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'jaeger.rob@gmail.com',
    from: 'robbie@turing.io',
    subject: 'New Lump Hammer Tweet',
    html: `<h1>Lump Hammer Alert</h1>
           <h3>See if there are some new lump hammers available by Crucible Tools!</h3>
           <p><a href="https://twitter.com/RudeMechanic" target="_blank">Chris Schwarz Twitter</a></p>
           <p><a href="https://lostartpress.com/collections/tools/products/lump-hammer" target="_blank">Crucible Tool Lump Hammer</a></p>`
  };

  sgMail.send(msg);
}

function sendStillSearchingEmail() {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'jaeger.rob@gmail.com',
    from: 'robbie@turing.io',
    subject: 'Still Looking For Hammer',
    html: `<p>Still OK scraping Twitter.</p>`
  };

  sgMail.send(msg); 
}

function getCurrentTime() {
  const currentUTC = new Date;
  const hour = currentUTC.getUTCHours();
  const minutes = currentUTC.getUTCMinutes();

  return {hour, minutes};
}

(async () => {
  let browser;
  let page;

  try {
    browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    page = await browser.newPage();
    await page.goto('https://twitter.com/RudeMechanic');
  } catch(err) {
    console.log(err);
  }

  const hammerTweets = await page.evaluate(() => {
    const timelineTweets = [...document.querySelector('ol.stream-items').children];
    const tweetTexts = timelineTweets.map(tweet => {
      return tweet.querySelector('p.tweet-text').innerText;
    }).slice(0,1);

    return tweetTexts.filter(text => {
      return text.toLowerCase().includes('lump');
    });
  });

  await browser.close();
  const {hour, minutes} = getCurrentTime();

  if (hammerTweets.length) {
    sendFoundEmail();
  } else if ( hour < 1 && minutes <= 10 ) {
    sendStillSearchingEmail();
  }
})();
