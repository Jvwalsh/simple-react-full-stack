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


// http://www.ctabustracker.com/bustime/api/v1/getstops?key=89dj2he89d8j3j3ksjhdue93j&rt=20&dir=East%20Bound

module.exports = {
  busFunc,
  getDirections
};
