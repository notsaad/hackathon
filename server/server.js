const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors")
const Constants = require('./Constants');
const dotenv = require('dotenv');
var bodyParser = require("body-parser");
const axios = require("axios");

var http = require('http');
const { json } = require("express/lib/response");
const c = require("colour");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use(bodyParser.json());


const httpServer = http.createServer(app);

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/test', (req, res) => {
    let tmp = {test: "Bob"}
    console.log('req')
    res.send(JSON.stringify(tmp));
})

/*
    req.body: {
        name: name of product
        country: country to look for products in
    }
*/
app.post('/ebay', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://ebay-data-scraper.p.rapidapi.com/products',
        params: {page_number: '1', product_name: req.body.name, country: req.body.country},
        headers: {
          'X-RapidAPI-Key': process.env.API_KEY,
          'X-RapidAPI-Host': 'ebay-data-scraper.p.rapidapi.com'
        }
      };
      
    axios.request(options).then( (response) => {
        console.log(response.data)
        res.send(JSON.stringify(response.data))
    }).catch((error) => {
        console.error(error)
    })
})

httpServer.listen(Constants.PORT, () => {
    console.log('Server listening on port: ', Constants.PORT)
}) 