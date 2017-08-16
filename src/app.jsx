"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');
var Api = require('./utils/api');

var query = ''; // Expects something like this ?city=London,Paris,Berlin,Madrid
var cities = []; // Transform query string cities into an array
var citiesWeather = []; // API cache
var currentCity = 0; // Index of current city displayed

//create react weather component
var Weather = new React.createClass({
    // Init data for UI
    getInitialState: function() {
        return {
            weather: '',
            temp: 0,
            humidity: 0,
            wind: 0,
            citiesWeather: []
        }
    },
    updateData: function() {
        let _cityWheather = [];
        let k = 0;
        citiesWeather.forEach(function(entry){
            _cityWheather[k] = {
                cityName: entry.cityName,
                weather: entry.weather[0].id,
                temp: Math.round(entry.main.temp - 273.15), // Kelvin to Celcius
                humidity: Math.round(entry.main.humidity),
                wind: Math.round(entry.wind.speed)
            };
            k++
        });
        this.setState({
            citiesWeather: _cityWheather,
        });
    },
    fetchData: function() {
        for(let i=0; i< cities.length; i++){
            if(cities[i]!="") {
                Api.get(cities[i])
                    .then(function (data) {
                        data.cityName = cities[i];
                        citiesWeather[i] = data;
                        this.updateData();
                    }.bind(this));
            }
        }
    },
    // Called before the render method is executed
    componentWillMount: function() {
        // Get the query string data
        query = location.search.split('=')[1];

        // Figure out if we need to display more than one city's weather
        if (query !== undefined) {
            cities = query.split(','); // Get an array of city names
        }
        else {
            cities[0] = 'Algiers'; // Set London as the default city
        }

        this.fetchData();
    },
    handleClick: function() {
        var input = this.refs.myInput;
        var inputValue = input.value;
        //If the city is already exist we ignore it
        if(cities.indexOf(inputValue) == -1){
            Api.get(inputValue)
                .then(function (data) {
                    data.cityName = inputValue;
                    cities.push(inputValue);
                    citiesWeather.push(data);
                    this.updateData();
                }.bind(this));
        }
    },

    render: function() {
        // Render the DOM elements
        var lis = [];
        let k = 0;
        this.state.citiesWeather.forEach(function(entry){
            // Build class names with dynamic data
            var weatherClass = classNames('wi wi-owm-' + entry.weather);
            var bgColorClass = 'weather-widget '; // very-warm, warm, normal, cold, very-cold

            // Set the background colour based on the temperature
            if (entry.temp >= 30) {
                bgColorClass += 'very-warm';
            }
            else if (entry.temp >= 20 && entry.temp < 30) {
                bgColorClass += 'warm';
            }
            else if (entry.temp >= 10 && entry.temp < 20) {
                bgColorClass += 'normal';
            }
            else if (entry.temp > 0 && entry.temp < 10) {
                bgColorClass += 'cold';
            }
            else if (entry.temp <= 0) {
                bgColorClass += 'very-cold';
            }
            lis.push(
                <div className="item  col-xs-4 col-lg-4 " key={k.toString()}>
                    <div className="thumbnail">
                        <div className={bgColorClass} >
                            <h1 className="city">{entry.cityName}</h1>
                            <div className="weather">
                                <i className={weatherClass}></i>
                            </div>
                        </div>
                        <div className="caption">
                            <section className="weather-details">
                                <div className="temp"><span className="temp-number">{entry.temp}</span><span
                                    className="wi wi-degrees"></span></div>
                                <div className="humidity"><i className="wi wi-raindrop"></i>{entry.humidity} %</div>
                                <div className="wind"><i className="wi wi-small-craft-advisory">{entry.wind} <span
                                    className="vel">Km/h</span></i></div>
                            </section>
                        </div>
                    </div>
                </div>
            );
            k++;
        });
        return(
            <div>

                <div className="row">
                    <div className="col-lg-12 city-field-container">
                        <div className="input-group">
                            <input type="text" className="form-control" ref="myInput" placeholder="Add you city here ..."/>
                            <span className="input-group-btn">
                                <button className="btn btn-default"  type="button" onClick={this.handleClick}>Add</button>
                            </span>
                        </div>
                    </div>

                </div>
                <div id="products" className="row list-group">{lis}</div>
            </div>
        );

    }
});
//create a DOM element and Assign the React component to a DOM element
var element = React.createElement(Weather, {});

//the the DOM element to our div element
ReactDOM.render(element, document.querySelector('.weatherContainer'));
