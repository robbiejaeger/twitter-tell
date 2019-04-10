const sgMail = require('@sendgrid/mail');
const puppeteer = require('puppeteer');

require('dotenv').config();

function sendEmail() {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'jaeger.rob@gmail.com',
    from: 'robbie@turing.io',
    subject: 'New Lump Hammers Available',
    html: `<h1>Lump Hammer Alert</h1>
           <p>See if there are some new lump hammers available by Crucible Tools</p>
           <a href="https://twitter.com/RudeMechanic" target="_blank">Chris Schwarz Twitter</a>
           <a href="https://crucibletool.com/products/crucible-lump-hammer" target="_blank">Crucible Tool Lump Hammer</a>`
  };

  sgMail.send(msg);
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
    });

    return tweetTexts.filter(text => {
      return text.toLowerCase().includes('lump');
    });
  });

  await browser.close();

  if (hammerTweets.length) {
    sendEmail();
  }
})();