const express = require("express");
const request = require("request");
const app = express();
const port = 5005;
const cors = require("cors")
const axios = require("axios");
const bodyParser = require("body-parser");
 
const apikey = "36f005e68b23bfafdf6791f4391f25a4";

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);

})

app.get('/:city', getData);

app.get('/:lat/:lon', pollution_data);

function checkforecast(temp, weather_arr) {
    for (var index = 0; index < (weather_arr.length); index++) {
        if (temp > 12) {
            carry = "Feels like cold";
        }
        else if (temp >= 12 && temp <= 24)
            carry = "Feels like warm";
        else {
            carry = "Feels like Hot"
        }
        return carry
    }
}
//function for api calling
async function getData(req, res) {
    //     let url = `https://api.openweathermap.org/data/2.5/forecast?q=London&units=metric&APPID=${apikey}`;
    //     let response = await fetch(url);
    //     const data = await response.json();
    //     res.send(data);
    console.log("weather forecast details request for city: " + req.params.city)


    
    // }
    // let x = {
    //     "x":"Hello World",
    // }
    let city = req.params.city; 
    let response
    try {
        
        response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${req.params.city}&cnt=32&units=metric&APPID=${apikey}`)
        console.log("Response from api :")
        console.log(response)
        const data = response.data; //fetching data from server
    console.log("Data from api :")
    // console.log(data)
    // if (data.cod == '404') {
    //     console.log("error found: ", error_found)
    // } else {
        let carry, rainfall, weather_desc, feels_like = '', date, temp, wind_speed = 0
        let weather_arr = {
            umbrella: 'No need to carry umbrella',
            carry: '',
            weather_forecast: []
        }
    
        for (var i = 0; i < (data.list.length); i++) {
            date = data.list[i].dt_txt
            weather_desc = data.list[i].weather[0].weather_desc
            feels_like = data.list[i].main.feels_like
            rainfall = data.list[i].main.rain;
            if (rainfall > 0) {
                umbrella = "You need to carry an umbrella";
            }
            carry = checkforecast(data.list[i].main.temp, weather_arr)
            wind_speed = data.list[i].wind.speed;
            temp = data.list[i].main.temp
    
            weather_arr.weather_forecast.push(
                {
                    City: city,
                    Date: date,
                    weather_detail: weather_desc,
                    temperature: temp,
                    Rain: rainfall,
                    windspeed: wind_speed,
                    unbrella: carry,
                    feels: feels_like

                }

            )
        }
        res.send(data);
    } catch (err) {
        res.send({cod:"404"})
        console.log("City not found: ", err)
    }   
    
}
//function for calling pollution api
async function pollution_data(req,res)
{
    response = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${req.params.lat}&lon=${req.params.lon}&appid=${apikey}`)
    console.log("Response from API: ")
    console.log(response)
    const data = response.data;
    console.log("data from API: ")
    console.log(data)
    res.send(data)

    
}
