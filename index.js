const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const cors = require('cors')

const app = express();
app.use(cors());

async function getData(city){

    let weatherData = {
        temperature: '',
        humidity: '',
        uvIndex: '',
        rainfallProbability: '',
        windSpeed: ''
    }
    
    let data = []

 let response = await axios.get(`https://timesofindia.indiatimes.com/travel/${city}/weather`);

 const $ = cheerio.load(response.data)
 const temp = $('.tempdigitbox');
data.push(temp.text())
 const dataList = $('.weather_list > li > strong');
 dataList.each(function(index, el){
    data.push($(el).text())
 })
 
 let i = 0;
 Object.keys(weatherData).forEach(item=>{
    
    weatherData[item] = data[i];
    i++;
 })
 return weatherData;
}

app.get('/:city', async (req, res)=>{
    const city = req.params.city
    
    let data = await getData(city);
    res.send(data);
});

app.listen(process.env.PORT, ()=>{
    console.log('Server Started at Port 3000');
});