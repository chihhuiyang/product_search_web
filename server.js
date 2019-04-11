var cors = require('cors');
var bodyParser = require('body-parser');
var queryString = require('querystring');
var request = require('request');
var express = require("express");
var url = require("url");
var server_app = express();


server_app.use(bodyParser.json());
server_app.use(cors());

server_app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});

server_app.use(express.static('public'));
server_app.use(express.static('files'));
server_app.use('/static', express.static('public'))

server_app.use(bodyParser.urlencoded({ extended: false }));

server_app.get("/", function(req, res){
  EBY_APP_ID = "ChihHuiY-search-PRD-716e2f5cf-2d4bc969";

  var input_data = url.parse(req.url, true).query;
  console.log(input_data);

  // ebay API request
  myDistance = input_data.distance;

  // ebay search api ----------------------
  if (typeof input_data.keyword !== 'undefined') {
    if (typeof input_data.location === 'undefined') { // current location
      var clientData = {
        "OPERATION-NAME": "findItemsAdvanced",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": EBY_APP_ID,
        "RESPONSE-DATA-FORMAT": "JSON",
        "REST-PAYLOAD": "",
        "paginationInput.entriesPerPage": 50,
        keywords: input_data.keyword,
        buyerPostalCode: input_data.zipcode,
        "itemFilter(0).name": "MaxDistance",
        "itemFilter(0).value": myDistance,
        "itemFilter(1).name": "HideDuplicateItems",
        "itemFilter(1).value": "true",
      }
      var clientContent = queryString.stringify(clientData);
      var ebay_search_api_url = 'http://svcs.ebay.com/services/search/FindingService/v1?' + clientContent;

      if (input_data.category != "default") {
        ebay_search_api_url += "&categoryId=" + input_data.category;
      }
      var i = 2;
      if (input_data.free_shipping == "true") {
        ebay_search_api_url += "&itemFilter(" + i + ").name=" + "FreeShippingOnly";
        ebay_search_api_url += "&itemFilter(" + i + ").value=" + "true";
        i++;
      }
      if (input_data.local_pickup == "true") {
        ebay_search_api_url += "&itemFilter(" + i + ").name=" + "LocalPickupOnly";
        ebay_search_api_url += "&itemFilter(" + i + ").value=" + "true";
        i++;
      }
      if (input_data.local_pickup == "true") {
        ebay_search_api_url += "&itemFilter(" + i + ").name=" + "LocalPickupOnly";
        ebay_search_api_url += "&itemFilter(" + i + ").value=" + "true";
        i++;
      }
      var j = 0;
      if (input_data.new_condition == "true") {
        j++;
      }
      if (input_data.used == "true") {
        j++;
      }
      if (input_data.unspecified == "true") {
        j++;
      }
      if (j > 0) {
        ebay_search_api_url += "&itemFilter(" + i + ").name=Condition";
        var k = 0;
        if (input_data.new_condition == "true") {
          ebay_search_api_url += "&itemFilter(" + i + ").value(" + k + ")=New";
          k++;
        }
        if (input_data.used == "true") {
          ebay_search_api_url += "&itemFilter(" + i + ").value(" + k + ")=Used";
          k++;
        }
        if (input_data.unspecified == "true") {
          ebay_search_api_url += "&itemFilter(" + i + ").value(" + k + ")=Unspecified";
          k++;
        }
      }
      ebay_search_api_url += "&outputSelector(0)=SellerInfo";
      ebay_search_api_url += "&outputSelector(1)=StoreInfo";

      console.log(ebay_search_api_url);
      //send request to ebay search api
      request.get(ebay_search_api_url, function(apiError, apiResponse, apiBody)
      {
        var ebay_search_api_result = JSON.parse(apiBody);
        console.log(ebay_search_api_result);
        res.send(ebay_search_api_result);
      });

    } else {  // zip code location
        
      var clientData = {
        "OPERATION-NAME": "findItemsAdvanced",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": EBY_APP_ID,
        "RESPONSE-DATA-FORMAT": "JSON",
        "REST-PAYLOAD": "",
        "paginationInput.entriesPerPage": 50,
        keywords: input_data.keyword,
        buyerPostalCode: input_data.location,
        "itemFilter(0).name": "MaxDistance",
        "itemFilter(0).value": myDistance,
        "itemFilter(1).name": "HideDuplicateItems",
        "itemFilter(1).value": "true",        
      }
      var clientContent = queryString.stringify(clientData);
      var ebay_search_api_url = 'http://svcs.ebay.com/services/search/FindingService/v1?' + clientContent;

      if (input_data.category != "default") {
        ebay_search_api_url += "&categoryId=" + input_data.category;
      }
      var i = 2;
      if (input_data.free_shipping == "true") {
        ebay_search_api_url += "&itemFilter(" + i + ").name=" + "FreeShippingOnly";
        ebay_search_api_url += "&itemFilter(" + i + ").value=" + "true";
        i++;
      }
      if (input_data.local_pickup == "true") {
        ebay_search_api_url += "&itemFilter(" + i + ").name=" + "LocalPickupOnly";
        ebay_search_api_url += "&itemFilter(" + i + ").value=" + "true";
        i++;
      }
      if (input_data.local_pickup == "true") {
        ebay_search_api_url += "&itemFilter(" + i + ").name=" + "LocalPickupOnly";
        ebay_search_api_url += "&itemFilter(" + i + ").value=" + "true";
        i++;
      }
      var j = 0;
      if (input_data.new_condition == "true") {
        j++;
      }
      if (input_data.used == "true") {
        j++;
      }
      if (input_data.unspecified == "true") {
        j++;
      }
      if (j > 0) {
        ebay_search_api_url += "&itemFilter(" + i + ").name=Condition";
        var k = 0;
        if (input_data.new_condition == "true") {
          ebay_search_api_url += "&itemFilter(" + i + ").value(" + k + ")=New";
          k++;
        }
        if (input_data.used == "true") {
          ebay_search_api_url += "&itemFilter(" + i + ").value(" + k + ")=Used";
          k++;
        }
        if (input_data.unspecified == "true") {
          ebay_search_api_url += "&itemFilter(" + i + ").value(" + k + ")=Unspecified";
          k++;
        }
      }
      ebay_search_api_url += "&outputSelector(0)=SellerInfo";
      ebay_search_api_url += "&outputSelector(1)=StoreInfo";

      console.log(ebay_search_api_url);
      //send request to ebay search api
      request.get(ebay_search_api_url, function(apiError, apiResponse, apiBody)
      {
        var ebay_search_api_result = JSON.parse(apiBody);
        console.log(ebay_search_api_result);
        res.send(ebay_search_api_result);
      });

    }
  } else if (typeof input_data.itemId_single !== 'undefined') {  // ebay single item api -------------------    
    var clientData = {
      callname: "GetSingleItem",
      responseencoding: "JSON",
      appid: EBY_APP_ID,
      siteid: 0,
      version: 967,
      ItemID: input_data.itemId_single,
      IncludeSelector: "Description,Details,ItemSpecifics"
    }
    var clientContent = queryString.stringify(clientData);
    var ebay_single_api_url = 'http://open.api.ebay.com/shopping?' + clientContent;
    console.log(ebay_single_api_url);
    //send request to ebay single api
    request.get(ebay_single_api_url, function(apiError, apiResponse, apiBody)
    {
      var ebay_single_api_result = JSON.parse(apiBody);
      console.log(ebay_single_api_result);
      res.send(ebay_single_api_result);
    });
  } else if (typeof input_data.itemId_similar !== 'undefined') { // ebay similar api -------------------
    var similarData = {
      "OPERATION-NAME": "getSimilarItems",
      "SERVICE-NAME": "MerchandisingService",
      "SERVICE-VERSION": "1.1.0",
      "CONSUMER-ID": EBY_APP_ID,
      "RESPONSE-DATA-FORMAT": "JSON",
      "REST-PAYLOAD": "",
      itemId: input_data.itemId_similar,
      maxResults: 20
    }
    var similarContent = queryString.stringify(similarData);
    var ebay_similar_api_url = 'http://svcs.ebay.com/MerchandisingService?' + similarContent;
    console.log(ebay_similar_api_url);
    //send request to ebay similar api
    request.get(ebay_similar_api_url, function(apiError, apiResponse, apiBody)
    {
      var ebay_similar_api_result = JSON.parse(apiBody);
      console.log(ebay_similar_api_result);
      res.send(ebay_similar_api_result);
    });
  } else if (typeof input_data.keyword_photo !== 'undefined') {  // google custom search photo api ----------------------    
    var customSearchData = {
      q: input_data.keyword_photo,
      // cx: "005587525834822268829:faorxop51ku",
      cx: "016602558717099423026:agpnkyapbzm",
      imgSize: "huge",
      imgType: "news",
      num: 8,
      searchType: "image",
      // key: "AIzaSyB4UvDoBlxH6MIOneoSpgai6cT9Z9swChE"
      key: "AIzaSyCc1GkOKNOO1NdZy0Ny31ptf1gW1dFOCmE"
    }
    var client_custom_Content = queryString.stringify(customSearchData);
    var google_custom_search_api = 'https://www.googleapis.com/customsearch/v1?' + client_custom_Content;
    console.log(google_custom_search_api);
    //send request to google custom search api
    request.get(google_custom_search_api, function(apiError, apiResponse, apiBody)
    {
      var google_custom_search_api_result = JSON.parse(apiBody);
      console.log(google_custom_search_api_result);
      res.send(google_custom_search_api_result);
    });
  }


  // autocomplete api -------------------------------
  if (typeof input_data.postalcode_startsWith !== 'undefined') {
    var clientData = {
      postalcode_startsWith: input_data.postalcode_startsWith,
      country: "US",
      maxRows: 5,
      username: "chihhuiy"
    }
    var clientContent = queryString.stringify(clientData);
    var autocomplete_api_url = 'http://api.geonames.org/postalCodeSearchJSON?' + clientContent;
    console.log(autocomplete_api_url);
    //send request to autocomplete api
    request.get(autocomplete_api_url, function(apiError, apiResponse, apiBody)
    {
      var autocomplete_api_result = JSON.parse(apiBody);
      console.log(autocomplete_api_result);
      res.send(autocomplete_api_result);
    });
  }


});

server_app.listen(8081);
