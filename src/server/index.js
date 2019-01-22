const express = require('express');
const aa = require('express-async-await');
const os = require('os');
const {
  busFunc,
  getDirections,
  getStops,
  getTimes
} = require('./bustracker');

const app = aa(express());

app.use(express.static('dist'));
app.get('/api/busTracker', async (req, res) => {
  const busDataObj = await busFunc();
  return res.send({
    busDataObj
  });
});
app.post('/api/getDirections', async (req, res) => {
  const routeId = req.headers['route-id'];
  const busDataDirObj = await getDirections(routeId);
  return res.send({
    busDataDirObj
  });
});
app.post('/api/getStops', async (req, res) => {
  const routeId = req.headers['route-id'];
  const dir = req.headers['route-dir'];
  const busDataStopsObj = await getStops(routeId, dir);
  return res.send({
    busDataStopsObj
  });
});
app.post('/api/getPrdTimes', async (req, res) => {
  const routeId = req.headers['route-id'];
  const stop = req.headers['stop-id'];
  const busDataTimesObj = await getTimes(routeId, stop);
  return res.send({
    busDataTimesObj
  });
});

app.listen(8080, () => console.log('Listening on port 8080!'));
