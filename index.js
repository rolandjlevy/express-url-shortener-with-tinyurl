const express = require('express');
const app = express();
const path = require('path');
const tinyURL = require('tinyurl');
const he = require('he');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const isTag = (str) => /<[^>]*>/g.test(str);

app.post('/shortened', (req, res) => {
  const longUrl = req.body.longurl;
  const encodedUrl = he.encode(longUrl);
  getTinyURL(longUrl).then(result => {
  const trimmed = result.split('https://')[1];
  res.send(
    <h3>Result: shortened URL</h3>
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