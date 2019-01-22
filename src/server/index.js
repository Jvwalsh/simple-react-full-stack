const express = require('express');
const aa = require('express-async-await');
const os = require('os');
const { busFunc, getDirections } = require('./bustracker');

const app = aa(express());

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.get('/api/busTracker', async (req, res) => {
  const busDataObj = await busFunc();
  return res.send({
    busDataObj
  });
});
app.post('/api/getDirections', async (req, res) => {
//   Object.keys(req).forEach((key) => {
//     console.log('key :', key);
//   });
  const routeId = req.headers['route-id'];
  console.log('routeId :', routeId);
  //   console.log('req :', req);
  const busDataDirObj = await getDirections(routeId);
  return res.send({
    busDataDirObj
  });
});
app.listen(8080, () => console.log('Listening on port 8080!'));
