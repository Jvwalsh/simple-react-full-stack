const axios = require('axios');

const busFunc = async () => {
  console.log('are we calling?');
  const busTrackerApiPromise = axios.get(`http://ctabustracker.com/bustime/api/v2/getpredictions?key=${process.env.API_KEY}&rt=82&stpid=11261&format=json`);
  const [busTrackerApi] = await Promise.all([busTrackerApiPromise]);
  const busData = busTrackerApi.data;
  return busData;
};

const getDirections = async (route) => {
  const routeNum = Number(route);
  const busTrackerApiPromise = axios.get(`http://ctabustracker.com/bustime/api/v2/getdirections?key=${process.env.API_KEY}&rt=${routeNum}&format=json`);
  const [busTrackerApi] = await Promise.all([busTrackerApiPromise]);
  const directionsData = busTrackerApi.data;
  return directionsData;
};

const getStops = async (route, dir) => {
  const routeNum = Number(route);
  const busTrackerApiPromise = axios.get(`http://ctabustracker.com/bustime/api/v2/getstops?key=${process.env.API_KEY}&rt=${routeNum}&dir=${dir}&format=json`);
  const [busTrackerApi] = await Promise.all([busTrackerApiPromise]);
  const stopsData = busTrackerApi.data;
  return stopsData;
};

const getTimes = async (route, stop) => {
  const routeNum = Number(route);
  const busTrackerApiPromise = axios.get(`http://ctabustracker.com/bustime/api/v2/getpredictions?key=${process.env.API_KEY}&rt=${routeNum}&stpid=${stop}&format=json`);
  const [busTrackerApi] = await Promise.all([busTrackerApiPromise]);
  const stopsData = busTrackerApi.data;
  return stopsData;
};


module.exports = {
  busFunc,
  getDirections,
  getStops,
  getTimes
};
