const axios = require('axios');

const API_KEY = process.env.API_KEY;


const busFunc = async () => {
  const busTrackerApiPromise = axios.get(`http://ctabustracker.com/bustime/api/v2/getpredictions?key=${API_KEY}&rt=82&stpid=11261&format=json`);
  const [busTrackerApi] = await Promise.all([busTrackerApiPromise]);
  const busData = busTrackerApi.data;
  return busData;
};

module.exports = busFunc;
