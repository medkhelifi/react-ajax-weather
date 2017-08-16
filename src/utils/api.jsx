var Fetch = require('whatwg-fetch');
var rootUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';
var apiUrl = '&appid=YOUR_API_KEY_GOES_HERE';

module.exports = {
    get: function(place) {
        return fetch(rootUrl + place + apiUrl, {
            headers: {
                // No need for special headers
            }
        })
        .then(function(response) {
            return response.json();
        });
    }
};