import React, { Component } from 'react';
import './app.css';
import Select from 'react-select';
import routes from '../../routes';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null,
      currentCount: 0,
      busData: {},
      options: [{ value: 'nothing', label: 'wtf is label' }],
      selectedOption: null,
      directionsOptions: [{ value: 'nothing', label: 'wtf is label' }],
      selectedDirectionsOptions: null,
      stopOptions: [{ value: 'nothing', label: 'wtf is label' }],
      selectedStopOptions: null,
    };
    this.timer = this.timer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDirChange = this.handleDirChange.bind(this);
  }

  componentDidMount() {
    this.timer();
    const intervalId = setInterval(this.timer, 60000);
    const options = [];
    Object.keys(routes).forEach((routeKey) => {
      options.push({ value: routes[routeKey].rt, label: routes[routeKey].rtnm });
    });
    this.setState({ intervalId });
    this.setState({ options });
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    fetch('/api/getDirections', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'route-id': selectedOption.value
      }
    })
      .then(res => res.json())
      .then((data) => {
        const directionsOptions = [];
        const dataDirectionsOptions = data.busDataDirObj['bustime-response'];
        const dirArr = dataDirectionsOptions.directions;
        dirArr.forEach((direction) => {
          directionsOptions.push({ value: direction.dir, label: direction.dir });
        });
        this.setState({ directionsOptions });
      });
    this.timer();
  }

  handleDirChange = (selectedDirectionsOptions) => {
    const { selectedOption } = this.state;
    const dirWord = selectedDirectionsOptions.value;
    this.setState({ selectedDirectionsOptions });
    fetch('/api/getStops', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'route-id': selectedOption.value,
        'route-dir': dirWord
      }
    })
      .then(res => res.json())
      .then((data) => {
        const stopOptions = [];
        const stopsArr = data.busDataStopsObj['bustime-response'].stops;
        stopsArr.forEach((stop) => {
          stopOptions.push({ value: stop.stpid, label: stop.stpnm });
        });
        this.setState({ stopOptions });
      });
    this.timer();
  }

  handleStopChange = (selectedStopOptions) => {
    const { selectedOption } = this.state;
    const stopId = selectedStopOptions.value;
    this.setState({ selectedStopOptions });
    fetch('/api/getPrdTimes', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'route-id': selectedOption.value,
        'stop-id': stopId
      }
    })
      .then(res => res.json())
      .then((data) => {
        const timeObj = data.busDataTimesObj['bustime-response'];
        this.setState({ busData: timeObj });
      });
  }

  timer = () => {
    const { currentCount } = this.state;
    this.setState({ currentCount: currentCount + 1 });
    fetch('/api/busTracker')
      .then(res => res.json())
      .then((data) => {
        this.setState({ busData: data.busDataObj['bustime-response'] });
      });
  }

  render() {
    const {
      currentCount,
      busData,
      options,
      selectedOption,
      directionsOptions,
      selectedDirectionsOptions,
      stopOptions,
      selectedStopOptions
    } = this.state;
    const busDataPrd = busData ? busData.prd : [];
    const date = new Date();
    const hourString = date.getHours() === 0 ? '0' : date.getHours();
    const minutes = date.getMinutes();
    function minuteStringFunc() {
      if (minutes === 0) {
        return '00';
      }
      if (minutes < 10) {
        return `0${minutes}`;
      }
      return minutes;
    }
    const minuteString = minuteStringFunc();
    const timeString = ` ${hourString}:${minuteString}`;

    return (
      <div>
        <h3>Welcome to the J Vinny Bus Dashboard</h3>
        <table>
          <tr>
            <th>Bus ID</th>
            <th>Distance (miles)</th>
            <th>Time (minutes)</th>
            <th>
              Time:
              {timeString}
            </th>
          </tr>
          {busDataPrd ? busDataPrd.map(bus => (
            <tr key={bus.vid} className={bus.prdctdn < 5 ? 'arriving-soon' : ''}>
              <td>
                {bus.vid}
              </td>
              <td>
                {typeof bus.dstp === 'number' ? Math.round(bus.dstp / 5280 * 100) / 100 : bus.dstp}
              </td>
              <td className={bus.prdctdn <= 2 ? 'arriving-verysoon' : ''}>
                {bus.prdctdn}
              </td>
              <td>
                Updated:
                {bus.tmstmp.split(' ')[1]}
              </td>
            </tr>
          ))
            : (
              <tr>
                <td>
                  -
                </td>
                <td>
                  -
                </td>
                <td>
                  -
                </td>
              </tr>
            )}
        </table>
        <p>Customize your experience...</p>
        <div className="select-container">
          <div className="select-item">
            { selectedOption === null ? <p>Select a route</p> : <div />}
            <Select
              value={selectedOption}
              onChange={this.handleChange}
              options={options}
              className="react-select"
            />
          </div>
          <div className="select-item">
            { selectedDirectionsOptions === null ? <p>Select directions for the route</p> : <div />}
            <Select
              value={selectedDirectionsOptions}
              onChange={this.handleDirChange}
              options={directionsOptions}
              className="react-select"
            />
          </div>
          <div className="select-item">
            { selectedStopOptions === null ? <p>Select stop for the route</p> : <div />}
            <Select
              value={selectedStopOptions}
              onChange={this.handleStopChange}
              options={stopOptions}
              className="react-select"
            />
          </div>
        </div>
        <p>Updates this session: </p>
        {currentCount}
      </div>
    );
  }
}
