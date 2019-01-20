const express = require('express');
const aa = require('express-async-await');
const os = require('os');
const ctaFunc = require('./bustracker.js');

const app = aa(express());

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.get('/api/busTracker', async (req, res) => {
  const busDataObj = await ctaFunc();
  return res.send({
    busDataObj
  });
});
app.listen(8080, () => console.log('Listening on port 8080!'));
