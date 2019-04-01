var cors = require('cors');
var bodyParser = require('body-parser');
var queryString = require('querystring');
var https = require('https');
var request = require('request');
var promise = require('promise');
var express = require("express");
var url = require("url");
var serverApp = express();
var router = express.Router();

const YELP_APIKEY = "SE7TiH0yZ0PTeQaRPHJANY_Dmdf5GYRbheeevXG7ydRg7eX5J3L9s6utXD9cOUR-6HmCnnCbHak-CaVS9lY6hvo-k8X3F-D9SDQp6XvG7YH1lNrR2aF7uFrWuRq_WnYx";
const yelp = require('yelp-fusion');
const client = yelp.client(YELP_APIKEY);

serverApp.all('*', function(req, res, next)
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});

serverApp.use(cors());
serverApp.get('/products/:id', function (req, res, next)
{
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
serverApp.use(bodyParser.json());
serverApp.use(bodyParser.urlencoded({ extended: false }));

serverApp.get("/", function(req, res){
  EBY_APP_ID = "ChihHuiY-search-PRD-716e2f5cf-2d4bc969";

  API_KEY = "AIzaSyC9HBExGTftsTmeBjHXLucUi5NH2QXCQkY";
  var clientInput = url.parse(req.url, true).query;
  console.log(clientInput);

  // ebay API request
  myDistance = clientInput.distance;


  if (typeof clientInput.location == 'undefined') { // current location
    var clientData = {
      "OPERATION-NAME": "findItemsAdvanced",
      "SERVICE-VERSION": "1.0.0",
      "SECURITY-APPNAME": EBY_APP_ID,
      "RESPONSE-DATA-FORMAT": "JSON",
      "REST-PAYLOAD": "",
      "paginationInput.entriesPerPage": 50,
      keywords: clientInput.keyword,
      buyerPostalCode: 90007,
      "itemFilter(0).name": "MaxDistance",
      "itemFilter(0).value": myDistance,

      "outputSelector(0)": "SellerInfo",
      "outputSelector(1)": "StoreInfo"
    }
    var clientContent = queryString.stringify(clientData);
    var ebay_search_api_url = 'http://svcs.ebay.com/services/search/FindingService/v1?' + clientContent;
    console.log(ebay_search_api_url);
    //send request to ebay search api
    request.get(ebay_search_api_url, function(apiError, apiResponse, apiBody)
    {
      var ebay_search_api_result = JSON.parse(apiBody);
      console.log(ebay_search_api_result);
      res.send(ebay_search_api_result);
    });

  } else {  // zip code location
      // TODO
  }


/*
  // Google API request
  if (typeof clientInput.ifYelp === 'undefined')
  {
    if (typeof clientInput.nextPageToken === 'undefined')
    {
      myDistance = clientInput.distance / 0.00062137;
      //if "current location" is selected
      if (typeof clientInput.location === 'undefined')
      {
        var clientData = {
          location: clientInput.latitude + "," + clientInput.longitude,
          radius: myDistance,
          type: clientInput.category,
          keyword: clientInput.keyword,
          key: API_KEY
        }
        var clientContent = queryString.stringify(clientData);
        var googlePlacesApiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + clientContent;
        console.log(googlePlacesApiUrl);

        //send request to google places api
        request.get(googlePlacesApiUrl, function(apiError, apiResponse, apiBody)
        {
          var googlePlacesApiResults = JSON.parse(apiBody);
          console.log(googlePlacesApiResults);
          res.send(googlePlacesApiResults);
        });
      }

      //if "other location" is selected
      else
      {
        var addressData = {
          address: clientInput.location,
          key: API_KEY
        }
        console.log(addressData);
        var addressContent = queryString.stringify(addressData);
        addressContent = addressContent.replace(' ', '+');
        var googleGeoCodingApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?' + addressContent;
        request.get(googleGeoCodingApiUrl, function(addressApiError, addressApiResponse, addressApiBody)
        {
          var googleGeoCodingApiResults = JSON.parse(addressApiBody);
          var latitude = googleGeoCodingApiResults['results'][0]['geometry']['location']['lat'];
          var longitude = googleGeoCodingApiResults['results'][0]['geometry']['location']['lng'];
          var clientData = {
            location: latitude + "," + longitude,
            radius: myDistance,
            type: clientInput.category,
            keyword: clientInput.keyword,
            key: API_KEY
          }
          var clientContent = queryString.stringify(clientData);
          var googlePlacesApiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + clientContent;
          console.log(googlePlacesApiUrl);

          //send request to google places api
          request.get(googlePlacesApiUrl, function(apiError, apiResponse, apiBody){
            var googlePlacesApiResults = JSON.parse(apiBody);
            googlePlacesApiResults['myLat'] = latitude;
            googlePlacesApiResults['myLng'] = longitude;
            res.send(googlePlacesApiResults);
          });
        });
      }
    }

    else
    {
      var clientData = {
        pagetoken: clientInput.nextPageToken,
        key: API_KEY
      }
      var clientContent = queryString.stringify(clientData);
      var googlePlacesApiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + clientContent;
      console.log(googlePlacesApiUrl);

      //send request to google places api
      request.get(googlePlacesApiUrl, function(apiError, apiResponse, apiBody)
      {
        var googlePlacesApiResults = JSON.parse(apiBody);
        console.log(googlePlacesApiResults);
        res.send(googlePlacesApiResults);
      });
    }
  }

  // Yelp API request
  else
  {
    // client.search(
    //   {
    //     term: clientInput.term,
    //     latitude: clientInput.lat,
    //     longitude: clientInput.lng
    //   })

      client.businessMatch('best',
      {
        name: clientInput.name,
        address1: clientInput.address1,
        address2: clientInput.address2,
        city: clientInput.city,
        state: clientInput.state,
        country: 'US'
      })
      .then(response =>
      {
        console.log(response);
        var yelpId = response.jsonBody.businesses[0].id;
        //console.log(yelpId);
        client.reviews(yelpId).
        then(response =>
        {
          //console.log(response.jsonBody);
          res.send(response.jsonBody);
        })
        .catch(e =>
        {
          console.log(e);
        });
      })
      .catch(error =>
      {
        console.log(error);
      });
  }
*/


});

serverApp.listen(8081);
