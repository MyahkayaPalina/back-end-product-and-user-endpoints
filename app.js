const express = require('express');
const bodyParser = require('body-parser');

const app = express();

let collection = null;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/create', (req, res, next) => {
  collection = req.body ? req.body : [];
  res.redirect('/');
});

app.use('/edit', (req, res, next) => {
  const { key, value } = req.body;
  const idx = collection.findIndex(item => item.key === key);
  collection[idx].value = value;
  res.redirect('/');
});

app.use('/remove', (req, res, next) => {
  const { key } = req.body;
  const idx = collection.findIndex(item => item.key === key);
  collection.splice(idx,1);
  res.redirect('/');
});

app.use('/add', (req, res, next) => {
  const { key, value } = req.body;
  collection.push(req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  const html = `<h1>Collection is: ${JSON.stringify(collection)}</h1>`;
  res.send(html);
});

app.listen(2000);
