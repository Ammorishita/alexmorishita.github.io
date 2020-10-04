import React from "react";

class Weather extends React.Component {
  constructor(props) {
    super();
    this.getLocation = this.getLocation.bind(this);
    this.convertUnixTime = this.convertUnixTime.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.getLocation();
    this.state = {
      fahrenheit: "",
      celsius: "",
      climate: "",
      enabled: false,
    };
  }

  convertUnixTime(value) {
      const date = new Date(value * 1000);
      // Hours part from the timestamp
      const hours = date.getHours();
      // Minutes part from the timestamp
      const minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      const seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      const time =
        hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
        return time;
  }

  error(error) {
    // console.log("Error retrieving location: ", error);
  }
  success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const key = "1c2345da8528da89ff0071bcdd221cce";
    const api = `//api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    // console.log("url", api);
    fetch(api)
      .then(data => {
        return data.json();
      })
      .then(response => {
        // console.log("response", response);
        const description = response.weather[0].description;
        const temp = response.main.temp;
        // ° F = 9/5(K - 273) + 32
        const fahrenheit = ((9 / 5) * (temp - 273.15) + 32).toFixed(1);
        const celsius = (temp - 273.15).toFixed(1);
        const location = response.name;
        const image = response.weather[0].icon;
        const imageUrl = `https://openweathermap.org/img/wn/${image}@2x.png`;

        // const sunriseUnix = response.sys.sunrise
        // const sunsetUnix = response.sys.sunset;
        // const sunsetTime = this.convertUnixTime(sunsetUnix);
        // const sunriseTime = this.convertUnixTime(sunriseUnix);
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.


        this.setState({
          fahrenheit: fahrenheit,
          celsius: celsius,
          climate: description,
          location: location,
          image: imageUrl,
          enabled: true,
        });
      });
  }
  getLocation() {
    if (!navigator.geolocation) {
    } else {
      navigator.geolocation.getCurrentPosition(this.success, this.error);
    }
  }
  render() {
	  const activeClass = (this.props.active === "weather")
		  ? "weather active"
      : "weather";
      
    if(this.state.enabled) {
      return (
        <div className={activeClass}>
          <h3 className="weather__location">{this.state.location}</h3>
          <div className="weather__info">
            <img
              src={this.state.image}
              className="weather__image"
              alt="climate"
            />
            <div className="weather__temperature">
              <span className="weather__detail weather__detail--large">
                {this.state.fahrenheit}
              </span>
              <span className="weather__deetail weather__detail--label"> °F</span>
            </div>
          </div>
          <div className="weather__info">
            <span className="weather__detail">{this.state.climate}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className={activeClass}>
          <p className="weather__error">You have disabled weather location.</p>
          <p className="weather__info weather__info--error">Enable this in your browser settings.</p>
        </div>
      );
    }
  }
}
export default Weather;
