import React, { use, useEffect, useRef, useState } from "react";
import "./Weather.css";
import searchIcon from "../assets/search.png";
import clearIcon from "../assets/clear.png";
import cloudIcon from "../assets/cloud.png";
import rainIcon from "../assets/rain.png";
import snowIcon from "../assets/snow.png";
import drizzleIcon from "../assets/drizzle.png";
import windIcon from "../assets/wind.png";
import humidityIcon from "../assets/humidity.png";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherdata] = useState({
    humidity: "",
    windspeed: "",
    temperature: "",
    location: "",
    icon: clearIcon,
  });

  // 1. Add state for Dark Mode (reads initial value from localStorage)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const allicons = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": cloudIcon,
    "03n": cloudIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Please enter a city name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert("City not found");
        return;
      }

      console.log(data);
      const icon = allicons[data.weather[0].icon] || clearIcon;

      setWeatherdata({
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
      localStorage.setItem("lastCity", data.name);
    } catch (error) {
      setWeatherdata(false);
      console.error("Error fetching weather data:");
    }
  };

  // 2. Function to toggle dark mode state and save preference
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      localStorage.setItem("theme", nextMode ? "dark" : "light");
      return nextMode;
    });
  };

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");

    if (savedCity) {
      search(savedCity);

      if (inputRef.current) {
        inputRef.current.value = savedCity;
      }
    } else {
      search("helsinki");
    }
  }, []);

  return (
    // 3. Dynamically apply the "dark" class if isDarkMode is true
    <div className={`weather ${isDarkMode ? "dark" : ""}`}>
      
      {/* 4. Theme Toggle Button at the top */}
      <div className="theme-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </div>

      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="search city" />
        <img src={searchIcon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className="weathericon" />
          <p className="temperature">{weatherData.temperature}°c</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="data">
              <img src={humidityIcon} alt="" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="data">
              <img src={windIcon} alt="" />
              <div>
                <p>{weatherData.windspeed}Km/hr</p>
                <span>wind speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;