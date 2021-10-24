import React, { useEffect, useState } from 'react';

function Weather(props) {
    const [data, updateData] = useState({
        fahrenheit: '',
        celsius: '',
        climate: '',
        enabled: false,
        location: '',
        image: '',
    });

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const key = "1c2345da8528da89ff0071bcdd221cce";
        const api = `//api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
        fetch(api)
            .then(data => {
                return data.json();
            })
            .then(response => {
                const description = response.weather[0].description;
                const temp = response.main.temp;
                const fahrenheit = ((9 / 5) * (temp - 273.15) + 32).toFixed(1);
                const celsius = (temp - 273.15).toFixed(1);
                const location = response.name;
                const image = response.weather[0].icon;
                const imageUrl = `https://openweathermap.org/img/wn/${image}@2x.png`;

                updateData({
                    fahrenheit: fahrenheit,
                    celsius: celsius,
                    climate: description,
                    location: location,
                    image: imageUrl,
                    enabled: true,
                });
            });

    }
    const error = (error) => {

    }

    const getLocation = () => {
        if (!navigator.geolocation) {
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }
    useEffect( () => {
        getLocation();
    }, []);


    const convertUnixTime = (value) => {
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

    const activeClass = (props.active === "weather")
        ? "weather active"
        : "weather";

    if (data.enabled) {
        return (
            <div className={activeClass}>
                <h3 className="weather__location">{data.location}</h3>
                <div className="weather__info">
                    <img
                        src={data.image}
                        className="weather__image"
                        alt="climate"
                    />
                    <div className="weather__temperature">
                        <span className="weather__detail weather__detail--large">
                            {data.fahrenheit}
                        </span>
                        <span className="weather__deetail weather__detail--label"> °F</span>
                    </div>
                </div>
                <div className="weather__info">
                    <span className="weather__detail">{data.climate}</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className={activeClass}>
                <p className="weather__error">You have disabled weather location.</p>
                <p className="weather__info weather__info--error">Enable this in your browser settings.</p>
            </div>
        );
    }
}
export default Weather;