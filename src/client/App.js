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
      selectedDirectionsOptions: null
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
    console.log('handling change');
    console.log('the id :', selectedOption.value);
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

  handleDirChange = (selectedOption) => {
    this.setState({ selectedOption });
    fetch('/api/getDirections', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
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
      selectedDirectionsOptions
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
            <tr key={bus.vid}>
              <td>
                {bus.vid}
              </td>
              <td>
                {typeof bus.dstp === 'number' ? Math.round(bus.dstp / 5280 * 100) / 100 : bus.dstp}
              </td>
              <td>
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
        { selectedOption === null ? <p>Select a route</p> : <div />}
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          className="react-select"
        />
        { selectedDirectionsOptions === null ? <p>Select directions for the route</p> : <div />}
        <Select
          value={selectedDirectionsOptions}
          onChange={this.handleDirChange}
          options={directionsOptions}
          className="react-select"
        />
        <p>Updates this session: </p>
        {currentCount}
        { /* username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1> */}
      </div>
    );
  }
}
