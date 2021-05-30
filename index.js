const express = require('express');
const app = express();
const path = require('path');
const tinyURL = require('tinyurl');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h3>Url shortener using tinyurl</h3>
    <form action="/shortened" method="post">
      <input name="longurl" placeholder="Enter long URL..." value="http://rolandlevy.co.uk" />
      <button type="submit">Submit</button>
    </form>
    <a href="/shorten?longurl=http://rolandlevy.co.uk">Go</a>
  `);
});

app.get('/shorten', (req, res) => {
  const longUrl = req.query.longurl
  getTinyURL(longUrl).then(result => {
    res.send(result);
  });
});

app.post('/shortened', (req, res) => {
  const longUrl = req.body.longurl
  getTinyURL(longUrl).then(result => {
  const trimmed = result.split('https://')[1];
  console.log({trimmed})
  res.send(`
    <h3>Result</h3>
    <p>Long url is: ${longUrl}</p>
    <p>Shortened url is: <a href="${result}" target="_blank">${trimmed}</p>
    <a href="/">← Back</a>
  `);
  });
});

const getTinyURL = (url) => {
  return new Promise((resolve, reject) => {
    return tinyURL.shorten(url, (res, err) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

app.listen(() => {
  console.log('Listening on port', port);
});