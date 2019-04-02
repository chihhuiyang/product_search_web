
(function(angular)
{
  var detailsModule = angular.module('travelSearchMvc.detailsModule', ['ngRoute', 'ngAnimate']);
  detailsModule.config(['$routeProvider', function($routeProvider)
  {
    $routeProvider.when('/details_page', {
      templateUrl: 'details_page/detailsView.html',
      controller: 'detailsController'
    });
  }]);

  detailsModule.service('detailsDataService', function(resultsDataService)
  {
    this.setData = function(newVal)
    {
      resultsDataService.setData(newVal);
    };
    this.getData = function()
    {
      return resultsDataService.getData();
    };
  });

  detailsModule.controller('detailsController', ['$scope', '$http', '$rootScope', 'detailsDataService', '$location', function($scope, $http, $rootScope, detailsDataService, $location)
  {
    $rootScope.moveToRight = false;
    $rootScope.detailWishIconClass = $rootScope.jsonData[$rootScope.currentPage-1]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex].wishIconClass;
    $rootScope.shopping_cart = $rootScope.jsonData[$rootScope.currentPage-1]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex].shopping_cart;
    if (typeof $rootScope.passData === 'undefined' || (detailsDataService.getData().length === 4 && detailsDataService.getData() !== $rootScope.passData))
    {
      $rootScope.passData = detailsDataService.getData();
    }
    console.log($rootScope.passData);
    $scope.placeDetails = $rootScope.passData[0];
    $scope.placePhotos = $rootScope.passData[1];
    $scope.passedPage = $rootScope.passData[2];
    $scope.passedJsonObj = $rootScope.passData[3];  // ebay search API : [0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item']
    $scope.name = $scope.placeDetails.Title;

    
    var items = $scope.passedJsonObj[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
    for (var i = 0; i < items.length; i++) {
      if (items[i].itemId[0] == $scope.placeDetails.ItemID) {
        console.log(items[i].itemId[0]);

        // assign shipping tab
        if (items[i].shippingInfo[0].hasOwnProperty('shippingServiceCost')) {
          if (items[i].shippingInfo[0].shippingServiceCost[0].hasOwnProperty('__value__')) {
            $scope.showShippingCost = true;
            var shipping_str = items[i].shippingInfo[0].shippingServiceCost[0].__value__;
            var shipping_float = parseFloat(shipping_str);
            if (shipping_float == 0.0) {
              $scope.shippingCost = "Free Shipping";
            } else {
              $scope.shippingCost = shipping_str;
            }
          } else {
            $scope.showShippingCost = false;
          }
        } else {
          $scope.showShippingCost = false;
        }

        if (items[i].shippingInfo[0].hasOwnProperty('shippingLocation')) {
          $scope.showShippingLocation = true;
          $scope.shippingLocation = items[i].shippingInfo[0].shippingLocation[0];
        } else {
          $scope.showShippingLocation = false;
        }

        if (items[i].shippingInfo[0].hasOwnProperty('handlingTime')) {
          $scope.showHandlingTime = true;
          var time_str = items[i].shippingInfo[0].handlingTime[0];
          var time_int = parseInt(time_str);
          if (time_int == 0 || time_int == 1) {
          $scope.handlingTime = time_str + " Day";
          } else {
          $scope.handlingTime = time_str + " Days";
          }          
        } else {
          $scope.showHandlingTime = false;
        }
      
        if (items[i].shippingInfo[0].hasOwnProperty('expeditedShipping')) {
          $scope.showExpeditedShipping = true;
          $scope.expeditedShipping = items[i].shippingInfo[0].expeditedShipping[0];
        } else {
          $scope.showExpeditedShipping = false;
        }

        if (items[i].shippingInfo[0].hasOwnProperty('oneDayShippingAvailable')) {
          $scope.showOneDayShipping = true;
          $scope.oneDayShipping = items[i].shippingInfo[0].oneDayShippingAvailable[0];
        } else {
          $scope.showOneDayShipping = false;
        }

        if (items[i].hasOwnProperty('returnsAccepted')) {
          $scope.showReturnAccepted = true;
          $scope.returnAccepted = items[i].returnsAccepted[0];
        } else {
          $scope.showReturnAccepted = false;
        }

        // assign seller tab
        if (items[i].sellerInfo[0].hasOwnProperty('feedbackScore')) {
          $scope.showFeedbackScore = true;
          $scope.feedbackScore = items[i].sellerInfo[0].feedbackScore[0];
        } else {
          $scope.showFeedbackScore = false;
        }

        if (items[i].sellerInfo[0].hasOwnProperty('positiveFeedbackPercent')) {
          $scope.showPopularity = true;
          $scope.popularity = items[i].sellerInfo[0].positiveFeedbackPercent[0];
        } else {
          $scope.showPopularity = false;
        }

        if (items[i].sellerInfo[0].hasOwnProperty('feedbackRatingStar')) {
          $scope.showFeedbackRatingStar = true;
          $scope.feedbackRatingStar = items[i].sellerInfo[0].feedbackRatingStar[0];
        } else {
          $scope.showFeedbackRatingStar = false;
        }

        if (items[i].sellerInfo[0].hasOwnProperty('topRatedSeller')) {
          $scope.showTopRated = true;
          $scope.topRated = items[i].sellerInfo[0].topRatedSeller[0];
        } else {
          $scope.showTopRated = false;
        }

        if (items[i].hasOwnProperty('storeInfo')) {
          if (items[i].storeInfo[0].hasOwnProperty('storeName')) {
            $scope.showStoreName = true;
            $scope.storeName = items[i].sellerInfo[0].storeName[0];
          } else {
            $scope.showStoreName = false;
          }
  
          if (items[i].storeInfo[0].hasOwnProperty('storeURL')) {
            $scope.showBuyProductAt = true;
            $scope.buyProductAt_url = items[i].sellerInfo[0].storeURL[0];
          } else {
            $scope.showBuyProductAt = false;
          }
        } else {
          $scope.showStoreName = false;
          $scope.showBuyProductAt = false;
        }
        
      }
    }


    



/*
    $scope.destinationLat = $scope.placeDetails.geometry.location.lat();
    $scope.destinationLng = $scope.placeDetails.geometry.location.lng();
    $scope.destinationGeoLocation = {lat: $scope.destinationLat, lng: $scope.destinationLng};
*/    
    console.log($scope.placeDetails);

    $scope.myLocationOption = $scope.$parent.locationOption;
    if ($scope.myLocationOption === "option1")  // current location
    {
      /*
      $scope.currentLocation_lat = $scope.$parent.currentlat;
      $scope.currentLocation_lng = $scope.$parent.currentlng;
      $scope.startGeoLocation = {lat: $scope.currentLocation_lat, lng: $scope.currentLocation_lng};
      $scope.currentGeoLocation = $scope.startGeoLocation;
      $scope.startLocation = "Your location";
      */
    }
    else  // TODO : zip code location
    {
      // $scope.inputLocation_lat = $scope.$parent.myLat;
      // $scope.inputLocation_lng = $scope.$parent.myLng;
      $scope.myInputLocation = $scope.$parent.myInputLocation;
      //$scope.startGeoLocation = {lat: $scope.inputLocation_lat, lng: $scope.inputLocation_lng};
      $scope.startLocation = $scope.myInputLocation;
    }

    // assign Product tab
    if ($scope.placeDetails.hasOwnProperty('PictureURL')) {
      $scope.showProductImg = true;
      $scope.ProductImg = $scope.placeDetails.PictureURL;
    } else {
      $scope.showProductImg = false;
    }

    if ($scope.placeDetails.hasOwnProperty('Subtitle')) {
      $scope.showSubtitle = true;
      $scope.subtitle = $scope.placeDetails.Subtitle;
    } else {
      $scope.showSubtitle = false;
    }

    if ($scope.placeDetails.hasOwnProperty('CurrentPrice')) {
      if ($scope.placeDetails.CurrentPrice.hasOwnProperty('Value')) {
        $scope.showPrice = true;
        $scope.price = $scope.placeDetails.CurrentPrice.Value;
      } else {
        $scope.showPrice = false;
      }
    } else {
      $scope.showPrice = false;
    }

    if ($scope.placeDetails.hasOwnProperty('Location')) {
      $scope.showLocation = true;
      $scope.productLocation = $scope.placeDetails.Location;
      // $scope.ratingWidth = $scope.rating * 10
    } else {
      $scope.showLocation = false;
    }

    if ($scope.placeDetails.hasOwnProperty('ReturnPolicy')) {
      if ($scope.placeDetails.ReturnPolicy.hasOwnProperty('ReturnsAccepted') && $scope.placeDetails.ReturnPolicy.hasOwnProperty('ReturnsWithin')) {
        $scope.showReturnPolicy = true;
        $scope.returnPolicy = $scope.placeDetails.ReturnPolicy.ReturnsAccepted + " Within " + $scope.placeDetails.ReturnPolicy.ReturnsWithin;
      } else {
        $scope.showReturnPolicy = false;
      }
    } else {
      $scope.showReturnPolicy = false;
    }

    if ($scope.placeDetails.hasOwnProperty('ItemSpecifics')) {
      if ($scope.placeDetails.ItemSpecifics.hasOwnProperty('NameValueList')) {
        $scope.showItemSpecifics = true;
        $scope.itemSpecList = $scope.placeDetails.ItemSpecifics.NameValueList;
      } else {
        $scope.showItemSpecifics = false;
      }
    } else {
      $scope.showItemSpecifics = false;
    }

/*
    if ($scope.placeDetails.hasOwnProperty('opening_hours'))
    {
      $scope.showHours = true;
      var newDay = new Date();
      $scope.today = newDay.getDay();
      var openday = $scope.placeDetails.opening_hours.weekday_text[$scope.today];
      var openTime = openday.substring(openday.indexOf(":"), openday.length);
      if ($scope.placeDetails.opening_hours.open_now === false)
      {
        $scope.hours = "Closed";
      }
      else
      {
        $scope.hours = "Open now" + openTime;
      }
      $scope.weekdayHours = $scope.placeDetails.opening_hours.weekday_text;
      $scope.weekdayArr = [];
      $scope.weekdayHoursArr = [];
      if ($scope.today === 0)
        var todayIndex = 6;
      else
        var todayIndex = $scope.today-1;
      for (var i = 0; i < $scope.weekdayHours.length; i++)
      {
        $scope.weekdayArr[i] = $scope.weekdayHours[todayIndex].substring(0, $scope.weekdayHours[todayIndex].indexOf(":"));
        $scope.weekdayHoursArr[i] = $scope.weekdayHours[todayIndex].substring($scope.weekdayHours[todayIndex].indexOf(":")+1, $scope.weekdayHours[todayIndex].length);
        todayIndex++;
        if (todayIndex === 7)
        {
          todayIndex = 0;
        }
      }
    }
    else
    {
      $scope.showHours = false;
    }
*/

    $scope.ifHasPhotos = function()
    {
      if (typeof $scope.placePhotos === 'undefined' || $scope.placePhotos === null)
      {
        $scope.ifHasPhoto = false;
      }
      else
      {
        $scope.ifHasPhoto = true;
      }
    };

    $scope.getMap = function()
    {
      $scope.showMap = true;
      $scope.showRouteDetails = false;
      $scope.buttonImage = "http://www.pvhc.net/img22/moawaqcbhovgehpljceh.jpg";

      $scope.initMap();
      //Add placehold for destination's input box
      var targetName = $scope.placeDetails.name;
      var targetAddress = $scope.placeDetails.formatted_address;
      $scope.targetDestination = targetName + ", " + targetAddress;
    };

    $scope.initMap = function()
    {
      $scope.directionsDisplay = new google.maps.DirectionsRenderer({panel:document.getElementById('routeDetails')});
      $scope.directionsService = new google.maps.DirectionsService();

      $scope.newGoogleMap = new google.maps.Map(document.getElementById('googleMap'),
      {
        zoom: 10,
        center: $scope.destinationGeoLocation
      });
      $scope.newMarker = new google.maps.Marker(
      {
        position: $scope.destinationGeoLocation,
        map: $scope.newGoogleMap
      });
      $scope.directionsDisplay.setMap($scope.newGoogleMap);
    };

    $scope.calcRoute = function()
    {
      $scope.showRouteDetails = true;
      var startPoint;

      if ($scope.startLocation === "Your location" || $scope.startLocation === "My location"
       || $scope.startLocation === "your location" || $scope.startLocation === "my location")
      {
        if ($scope.myLocationOption === "option1")
        {
          startPoint = $scope.currentGeoLocation;
        }
        else
        {
          startPoint = $scope.myInputLocation;
        }
      }
      else
      {
        startPoint = $scope.startLocation;
        //console.log($scope.autocompleteObj);
        if (typeof $scope.autocompleteObj.getPlace() !== 'undefined')
        {
          $scope.startLocation = $scope.autocompleteObj.getPlace().formatted_address;
          startPoint = $scope.startLocation;
          console.log(startPoint);
        }
      }

      var directionMode = document.getElementById('travelModes').value;
      var request =
      {
        origin: startPoint,
        destination: $scope.destinationGeoLocation,
        travelMode: directionMode,
        provideRouteAlternatives: true
      };
      //console.log(request);
      $scope.directionsService.route(request, function(result, status)
      {
        if (status == 'OK')
        {
          //console.log(result);
          $scope.directionsDisplay.setDirections(result);
        }
        else
        {
          $scope.mapDirectionError = "Direction routes not found!";
          console.log($scope.mapDirectionError);
          $scope.showRouteDetails = false;
          alert($scope.mapDirectionError);
        }
      });
      $scope.newMarker.setMap(null);
    };

    $scope.getStreetView = function()
    {
      $scope.panorama = $scope.newGoogleMap.getStreetView();
      $scope.panorama.setPosition($scope.destinationGeoLocation);
      $scope.panorama.setPov(
      {
        heading: 250,
        pitch: 0
      });
    };

    $scope.switchMap = function()
    {
      if ($scope.showMap === true)
      {
        $scope.showMap = false;
        //$scope.buttonImage = "http://cs-server.usc.edu:45678/hw/hw8/images/Map.png";
        $scope.getStreetView();
        $scope.panorama.setVisible(true);
      }
      else
      {
        $scope.showMap = true;
        //$scope.buttonImage = "http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png";
        $scope.panorama.setVisible(false);
      }
    };

    $scope.checkDisableCondition = function()
    {
      $scope.mapForm.mapInputLocation.$setPristine();
      $scope.mapForm.mapInputLocation.$setUntouched();
      if ($scope.mapForm.mapInputLocation.$invalid)
      {
        return true;
      }
    };

    $scope.autoComplete = function()
    {
      var input = document.getElementById('mapInputLocation');
      var options = {types: ['address']};
      $scope.autocompleteObj = new google.maps.places.Autocomplete(input, options);
    };

    $scope.getReviews = function()
    {
      $scope.reviewTypeButtonName = "Google Reviews";
      $scope.reviewOrderButtonName = "Default Order";
      $scope.reviewSelection = true;
      if (typeof $scope.placeDetails.reviews === 'undefined' || $scope.placeDetails.reviews.length === 0)
      {
        $scope.ifHasGoogleReview = false;
      }
      else
      {
        $scope.ifHasGoogleReview = true;
        $scope.googleReviews = $scope.placeDetails.reviews;
        var oriTime = new Date('1970-01-01 00:00:00');
        for (var i = 0; i < $scope.googleReviews.length; i++)
        {
          var timeSecond = $scope.googleReviews[i].time;
          var newTime = moment(timeSecond*1000).format('YYYY-MM-DD HH:mm:ss')
          $scope.googleReviews[i]['newTime'] = newTime;
        }
        $scope.googleReviewsArr = $scope.googleReviews.slice(0);
        //console.log($scope.googleReviewsArr);
      }
    };

    $scope.showGoogleReviews = function()
    {
      $scope.reviewTypeButtonName = "Google Reviews";
      $scope.reviewSelection = true;
    };

    $scope.showYelpReviews = function()
    {
      $scope.reviewTypeButtonName = "Yelp Reviews"
      $scope.reviewSelection = false;
    };

    $scope.setArray = function(params)
    {
      return new Array(params);
    };

    $scope.getDefaultOrder = function()
    {
      $scope.reviewOrderButtonName = "Default Order";
      if (typeof $scope.googleReviews !== 'undefined')
      {
        $scope.googleReviewsArr = $scope.googleReviews.slice(0);
      }
      if (typeof $scope.yelpReviews !== 'undefined')
      {
        $scope.yelpReviewsArr = $scope.yelpReviews.slice(0);
      }
    };

    $scope.getHighestRatingOrder = function()
    {
      $scope.reviewOrderButtonName = "Highest Rating";

      if (typeof $scope.googleReviewsArr !== 'undefined')
      {
        var arrToSort1 = $scope.googleReviewsArr;
        arrToSort1.sort(function(a,b)
        {
          return parseFloat(b.rating) - parseFloat(a.rating);
        });
        $scope.googleReviewsArr = arrToSort1;
      }

      if (typeof $scope.yelpReviewsArr !== 'undefined')
      {
        var arrToSort2 = $scope.yelpReviewsArr;
        arrToSort2.sort(function(a,b)
        {
          return parseFloat(b.rating) - parseFloat(a.rating);
        });
        $scope.yelpReviewsArr = arrToSort2;
      }
    };

    $scope.getLowestRatingOrder = function()
    {
      $scope.reviewOrderButtonName = "Lowest Rating";

      if (typeof $scope.googleReviewsArr !== 'undefined')
      {
        var arrToSort1 = $scope.googleReviewsArr;
        arrToSort1.sort(function(a,b)
        {
          return parseFloat(a.rating) - parseFloat(b.rating);
        });
        $scope.googleReviewsArr = arrToSort1;
      }

      if (typeof $scope.yelpReviewsArr !== 'undefined')
      {
        var arrToSort2 = $scope.yelpReviewsArr;
        arrToSort2.sort(function(a,b)
        {
          return parseFloat(a.rating) - parseFloat(b.rating);
        });
        $scope.yelpReviewsArr = arrToSort2;
      }
    };

    $scope.getMostRecentOrder = function()
    {
      $scope.reviewOrderButtonName = "Most Recent";

      if (typeof $scope.googleReviewsArr !== 'undefined')
      {
        var arrToSort1 = $scope.googleReviewsArr;
        arrToSort1.sort(function(a,b)
        {
          return parseFloat(b.time) - parseFloat(a.time);
        });
        $scope.googleReviewsArr = arrToSort1;
      }

      if (typeof $scope.yelpReviewsArr !== 'undefined')
      {
        var arrToSort2 = $scope.yelpReviewsArr;
        arrToSort2.sort(function(a,b)
        {
          return +new Date(b.time_created) - +new Date(a.time_created);
        });
        $scope.yelpReviewsArr = arrToSort2;
      }
    };

    $scope.getLeastRecentOrder = function()
    {
      $scope.reviewOrderButtonName = "Lowest Recent";

      if (typeof $scope.googleReviewsArr !== 'undefined')
      {
        var arrToSort1 = $scope.googleReviewsArr;
        arrToSort1.sort(function(a,b)
        {
          return parseFloat(a.time) - parseFloat(b.time);
        });
        $scope.googleReviewsArr = arrToSort1;
      }

      if (typeof $scope.yelpReviewsArr !== 'undefined')
      {
        var arrToSort2 = $scope.yelpReviewsArr;
        arrToSort2.sort(function(a,b)
        {
          return +new Date(a.time_created) - +new Date(b.time_created);
        });
        $scope.yelpReviewsArr = arrToSort2;
      }
    };

    $scope.requestYelpApi = function()
    {
      var placeName = $scope.placeDetails.name;
      var fullAddress = $scope.placeDetails.formatted_address;
      var splitAddress = fullAddress.split(", ");
      var myAddress1 = splitAddress[0];
      var myAddress2 = splitAddress[1] + ", " + splitAddress[2];
      var myCity = splitAddress[1];
      var myState = splitAddress[2].substring(0, splitAddress[2].indexOf(" "));

      inputData =
      {
        ifYelp: "yelpData",
        name: placeName,
        address1: myAddress1,
        address2: myAddress2,
        city: myCity,
        state: myState,
        country: 'US'
      }
      console.log(inputData);

      $http({
        method: 'GET',
        url: "http://localhost:8081/?",
        // url: 'http://hw8-result.us-east-2.elasticbeanstalk.com/',
        // url: 'http://travelsearchnodejs-env.us-east-2.elasticbeanstalk.com/',
        params: inputData
      })
      .then (function (response)
      {
        //console.log(response);
        $scope.yelpReviews = response.data.reviews;
        var defaultProfilePhoto = "https://s3-media1.fl.yelpcdn.com/photo/uup2RtyJCfUuMALwNBxITA/o.jpg";
        for (var i = 0; i < $scope.yelpReviews.length; i++)
        {
          if ($scope.yelpReviews[i].user.image_url == null)
          {
            $scope.yelpReviews[i].user.image_url = defaultProfilePhoto;
          }
        }
        $scope.yelpReviewsArr = $scope.yelpReviews.slice(0);
        //console.log($scope.yelpReviewsArr);
      },
      function(response)
      {
        console.error("Request error!");
      });
    };

    $scope.ifHasYelpReviews = function()
    {
      if (typeof $scope.yelpReviewsArr === 'undefined' || $scope.yelpReviewsArr.length === 0)
      {
        //console.log(typeof $scope.yelpReviewsArr);
        $scope.ifHasYelpReview = false;
      }
      else
      {
        $scope.ifHasYelpReview = true;
      }
    };

    $scope.openTweetWindow = function()
    {
      if ($scope.placeDetails.hasOwnProperty('ViewItemURLForNaturalSearch')) {
        var placeUrl = $scope.placeDetails.ViewItemURLForNaturalSearch;
      } else {
        var placeUrl = "http://www.google.com/";
      }

      var fb_text = "Buy " + $scope.placeDetails.Title;;
      fb_text += " at $" + $scope.placeDetails.CurrentPrice.Value;
      fb_text += " from LINK below.";
      var fb_url = "https://www.facebook.com/dialog/share?app_id=412937185919670&display=popup&href=" + placeUrl + "&quote=" + fb_text;
      $scope.tweetWindow = window.open(fb_url, "Share a link on Facebook");
    };

    $scope.goBack = function()
    {
      $rootScope.ifSlide = true;
      $rootScope.moveToRight = false;
      if ($location.path() === '/details_page')
      {
        $scope.rePassData = [];
        $scope.rePassData[0] = $scope.passedPage;
        $scope.rePassData[1] = $scope.passedJsonObj;
        detailsDataService.setData($scope.rePassData);
        window.history.back();
      }
      else if ($location.path() === '/favoriteDetails_page')
      {
        $location.path('/favorites_page');
      }
    }

    $scope.addToFavorite = function()
    {
      if ($rootScope.detailWishIconClass === "material-icons md-18")
      {
        $rootScope.detailWishIconClass = "material-icons md-18 yellow";
        $rootScope.shopping_cart = "remove_shopping_cart";
        $rootScope.jsonData[$rootScope.currentPage-1].results[$rootScope.currentIndex]['wishIconClass'] = $rootScope.detailWishIconClass;
        $rootScope.jsonData[$rootScope.currentPage-1].results[$rootScope.currentIndex]['shopping_cart'] = $rootScope.shopping_cart;
        var myKey = $scope.placeDetails.place_id;
        $scope.savedData = [];
        $scope.savedData[0] = $scope.placeDetails;
        $scope.savedData[1] = $scope.placePhotos;
        $scope.savedData[2] = $rootScope.curRowData;
        $scope.savedData[3] = $scope.myLocationOption;
        //console.log($scope.myLocationOption);
        if ($scope.myLocationOption === "option1")
        {
          $scope.savedData[4] = $scope.startGeoLocation;
        }
        else
        {
          $scope.savedData[4] = $scope.myInputLocation;
        }
        var timeStamp = Date.now();
        $scope.savedData[5] = timeStamp;
        localStorage.setItem(myKey, JSON.stringify($scope.savedData));
      }
      else
      {
        $rootScope.detailWishIconClass = "material-icons md-18";
        $rootScope.shopping_cart = "add_shopping_cart";
        $rootScope.jsonData[$rootScope.currentPage-1].results[$rootScope.currentIndex]['wishIconClass'] = $rootScope.detailWishIconClass;
        $rootScope.jsonData[$rootScope.currentPage-1].results[$rootScope.currentIndex]['shopping_cart'] = $rootScope.shopping_cart;
        localStorage.removeItem($scope.placeDetails.place_id);
      }

    }
  }]);
})(angular);
