import React, { Component } from 'react';
import './app.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null,
      currentCount: 0,
      busData: {}
    };
    this.timer = this.timer.bind(this);
  }

  componentDidMount() {
    const intervalId = setInterval(this.timer, 15000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
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
    const { currentCount, busData } = this.state;
    const busDataPrd = busData ? busData.prd : [];
    const date = new Date();
    const timeString = String(date.getHours()) + ':' + String(date.getMinutes());
    return (
      <div>
        <p>Welcome to the J Vinny Bus Dashboard</p>
        <table>
          <tr>
            <th>Bus ID</th>
            <th>Distance (miles)</th>
            <th>Time (minutes)</th>
            <th>
              Current time:
              {timeString}
            </th>
          </tr>
          {busDataPrd ? busDataPrd.map(bus => <tr key={bus.vid}><td>{bus.vid}</td><td>{typeof bus.dstp === "number" ? Math.round(bus.dstp / 5280 * 100) / 100 : bus.dstp}</td><td>{bus.prdctdn}</td><td>Updated at: {bus.tmstmp.split(' ')[1]}</td></tr>) : <tr><td>-</td><td>-</td><td>-</td></tr>}
        </table>
        <p>Updates this session: </p>
        {currentCount}
        { /* username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1> */}
      </div>
    );
  }
}
