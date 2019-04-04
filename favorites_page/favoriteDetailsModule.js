
(function(angular)
{
  var favoriteDetailsModule = angular.module('travelSearchMvc.favoriteDetailsModule', ['ngRoute', 'ngAnimate']);
  favoriteDetailsModule.config(['$routeProvider', function($routeProvider)
  {
    $routeProvider.when('/favoriteDetails_page', {
      templateUrl: 'details_page/detailsView.html',
      controller: 'favoriteDetailsController'
    });
  }]);

  favoriteDetailsModule.service('favoriteDetailsDataService', function(favoriteDataService)
  {
    this.setData = function()
    {
      favoriteDataService.setData('newVal');
    };
    this.getData = function()
    {
      return favoriteDataService.getData();
    };
  });

  favoriteDetailsModule.controller('favoriteDetailsController', ['$scope', '$http', '$rootScope', 'favoriteDetailsDataService', '$location', function($scope, $http, $rootScope, favoriteDetailsDataService, $location)
  {
    $rootScope.ifSlide = true;
    $rootScope.moveToRight = false;
    $rootScope.detailWishIconClass = "material-icons md-18";
    $rootScope.shopping_cart = "add_shopping_cart";

    $scope.dataPack = favoriteDetailsDataService.getData();
    console.log($scope.dataPack);
    console.log($rootScope);
    $scope.storageKey = $scope.dataPack[0];
    $scope.myLocationOption = $scope.dataPack[1];
    $scope.placeDetails = $scope.dataPack[3];
    $scope.photo_arr = $scope.dataPack[4];  // keyword + itemId
    $scope.name = $scope.placeDetails.Title;
    console.log(window.localStorage);

    $scope.ifHasPhoto = true;  // initail assign
    $scope.ifHasSimilar = true;  // initail assign


    $scope.currentStorage = window.localStorage;
    for (var i = 0; i < $scope.currentStorage.length; i++)
    {
      var currentKey = $scope.currentStorage.key(i);
      if (currentKey === $scope.storageKey)
      {
        $rootScope.detailWishIconClass = "material-icons md-18 yellow";
        $rootScope.shopping_cart = "remove_shopping_cart";
      }
    }

    for (var i = 0; i < $rootScope.favoriteRows.length; i++)
    {
      if ($rootScope.favoriteRows[i]['itemId'][0] === $scope.placeDetails.ItemID)
      {
        $rootScope.tempFavoriteRow = $rootScope.favoriteRows[i];
      }
    }

    // $scope.destinationLat = $scope.placeDetails.geometry.location.lat;
    // $scope.destinationLng = $scope.placeDetails.geometry.location.lng;
    // $scope.destinationGeoLocation = {lat: $scope.destinationLat, lng: $scope.destinationLng};

    if ($scope.myLocationOption === "option1")
    {
      // $scope.startGeoLocation = $scope.dataPack[2];
      // $scope.currentGeoLocation = $scope.startGeoLocation;
      $scope.startLocation = "90007";
    }
    else
    {
      $scope.myInputLocation = $scope.dataPack[2];
      $scope.startLocation = $scope.myInputLocation;
    }


    // assign Product tab
    console.log("assign Product tab");
    if ($scope.placeDetails.hasOwnProperty('PictureURL')) {
      $scope.showProductImg = true;
      $scope.ProductImg = $scope.placeDetails.PictureURL;
      console.log($scope.ProductImg);
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

     // assign seller tab
     console.log("assign seller tab");
     if ($scope.placeDetails.Seller.hasOwnProperty('FeedbackScore')) {
      $scope.showFeedbackScore = true;
      $scope.feedbackScore = $scope.placeDetails.Seller.FeedbackScore;
    } else {
      $scope.showFeedbackScore = false;
    }
    if ($scope.placeDetails.Seller.hasOwnProperty('PositiveFeedbackPercent')) {
      $scope.showPopularity = true;
      $scope.popularity = $scope.placeDetails.Seller.PositiveFeedbackPercent;
    } else {
      $scope.showPopularity = false;
    }
    if ($scope.placeDetails.Seller.hasOwnProperty('FeedbackRatingStar')) {
      $scope.showFeedbackRatingStar = true;
      $scope.feedbackRatingStar = $scope.placeDetails.Seller.FeedbackRatingStar;
    } else {
      $scope.showFeedbackRatingStar = false;
    }
    if ($scope.placeDetails.Seller.hasOwnProperty('TopRatedSeller')) {
      $scope.showTopRated = true;
      $scope.topRated = $scope.placeDetails.Seller.TopRatedSeller;
    } else {
      $scope.showTopRated = false;
    }
  
    if ($scope.placeDetails.hasOwnProperty('Storefront')) {
      if ($scope.placeDetails.Storefront.hasOwnProperty('StoreName')) {
        $scope.showStoreName = true;
        $scope.storeName = $scope.placeDetails.Storefront.StoreName;
      } else {
        $scope.showStoreName = false;
      }
      if ($scope.placeDetails.Storefront.hasOwnProperty('StoreURL')) {
        $scope.showBuyProductAt = true;
        $scope.buyProductAt_url = $scope.placeDetails.Storefront.StoreURL;
      } else {
        $scope.showBuyProductAt = false;
      }
    } else {
      $scope.showStoreName = false;
      $scope.showBuyProductAt = false;
    }


    // shipping
    var items = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
    console.log(items);
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

        
      }
    }

    $scope.ifHasPhotos = function()
    {
      if (typeof $scope.photo_arr === 'undefined' || $scope.photo_arr === null) {
        $scope.ifHasPhoto = false;
      } else {
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
          $scope.mapDirectionError = "Direction routes not found";
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
        $scope.buttonImage = "http://cs-server.usc.edu:45678/hw/hw8/images/Map.png";
        $scope.getStreetView();
        $scope.panorama.setVisible(true);
      }
      else
      {
        $scope.showMap = true;
        $scope.buttonImage = "http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png";
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
      $scope.googleReviewsArr = $scope.googleReviews.slice(0);
      $scope.yelpReviewsArr = $scope.yelpReviews.slice(0);
    };

    $scope.getHighestRatingOrder = function()
    {
      $scope.reviewOrderButtonName = "Highest Rating";

      var arrToSort1 = $scope.googleReviewsArr;
      arrToSort1.sort(function(a,b)
      {
        return parseFloat(b.rating) - parseFloat(a.rating);
      });
      $scope.googleReviewsArr = arrToSort1;

      var arrToSort2 = $scope.yelpReviewsArr;
      arrToSort2.sort(function(a,b)
      {
        return parseFloat(b.rating) - parseFloat(a.rating);
      });
      $scope.yelpReviewsArr = arrToSort2;
    };

    $scope.getLowestRatingOrder = function()
    {
      $scope.reviewOrderButtonName = "Lowest Rating";

      var arrToSort1 = $scope.googleReviewsArr;
      arrToSort1.sort(function(a,b)
      {
        return parseFloat(a.rating) - parseFloat(b.rating);
      });
      $scope.googleReviewsArr = arrToSort1;

      var arrToSort2 = $scope.yelpReviewsArr;
      arrToSort2.sort(function(a,b)
      {
        return parseFloat(a.rating) - parseFloat(b.rating);
      });
      $scope.yelpReviewsArr = arrToSort2;
    };

    $scope.getMostRecentOrder = function()
    {
      $scope.reviewOrderButtonName = "Most Recent";

      var arrToSort1 = $scope.googleReviewsArr;
      arrToSort1.sort(function(a,b)
      {
        return parseFloat(b.time) - parseFloat(a.time);
      });
      $scope.googleReviewsArr = arrToSort1;


      var arrToSort2 = $scope.yelpReviewsArr;
      arrToSort2.sort(function(a,b)
      {
        return +new Date(b.time_created) - +new Date(a.time_created);
      });
      $scope.yelpReviewsArr = arrToSort2;
    };

    $scope.getLeastRecentOrder = function()
    {
      $scope.reviewOrderButtonName = "Lowest Recent";

      var arrToSort1 = $scope.googleReviewsArr;
      arrToSort1.sort(function(a,b)
      {
        return parseFloat(a.time) - parseFloat(b.time);
      });
      $scope.googleReviewsArr = arrToSort1;

      var arrToSort2 = $scope.yelpReviewsArr;
      arrToSort2.sort(function(a,b)
      {
        return +new Date(a.time_created) - +new Date(b.time_created);
      });
      $scope.yelpReviewsArr = arrToSort2;
    };


    $scope.requestPhotoApi = function() {
      // photo tab
      // google custom search api -----------------------------------
      // if ($scope.ifHasPhoto == false) { // avoid re-call api
        var inputData = {
          keyword_photo: $scope.passData[1][0]
        }
        console.log(inputData);
        $http({
          method: 'GET',
          url: "http://localhost:8081/?",
          // url: 'http://hw8-result.us-east-2.elasticbeanstalk.com/',
          params: inputData
        })
        .then (function (response) {
          console.log("photo api response");
          $scope.photo_items = response.data.items;
          console.log($scope.photo_items);
          $scope.ifHasPhoto = false;
          if (typeof $scope.photo_items !== 'undefined') {
            $scope.photo_arr = [];
            for (var i = 0; i < $scope.photo_items.length; i++) {
              var photo_url = $scope.photo_items[i].link;
              $scope.photo_arr[i] = photo_url;
              $scope.ifHasPhoto = true;
            }
            console.log($scope.photo_arr);
          }
        },
        function(response)
        {
          console.error("Request error!");
          $rootScope.showProgressBar = false;
          $scope.ifHasPhoto = false;
        });
      // } else {
      //   console.log("duplicate requestPhotoApi ");
      // }
    };


    $scope.requestSimilarApi = function()  // requestYelpApi => requestSimilarApi
    {
      // similar tab
      // ebay similar api ------------------------------
      var inputSimilarData = {
        similar: "true",
        itemId_similar: $scope.placeDetails.ItemID
      }
      console.log(inputSimilarData);
      $http({
        method: 'GET',
        url: "http://localhost:8081/?",
        // url: 'http://hw8-result.us-east-2.elasticbeanstalk.com/',
        params: inputSimilarData
      })
      .then (function (response) {
        console.log("similar api response");
        console.log(response);
        $scope.similar_items = response.data.getSimilarItemsResponse.itemRecommendations.item;
        console.log($scope.similar_items);


        // getReviews(); 
        $scope.reviewTypeButtonName = "Default";
        $scope.reviewOrderButtonName = "Ascending";
        $scope.reviewSelection = true;
        if (typeof $scope.similar_items === 'undefined' || $scope.similar_items.length === 0) {
          $scope.ifHasSimilar = false;
        } else {
          $scope.ifHasSimilar = true;
          $scope.similar_items_arr = $scope.similar_items;

        }
        
      },
      function(response)
      {
        console.error("Request error!");
        $rootScope.showProgressBar = false;
        $scope.ifHasSimilar = false;
      });

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

      inputData = {
        ifYelp: "yelpData",
        name: placeName,
        address1: myAddress1,
        address2: myAddress2,
        city: myCity,
        state: myState,
        country: 'US'
      }
      //console.log(inputData);
      // inputData = {
      //   ifYelp: "yelpData",
      //   term: placeName,
      //   lat: $scope.destinationLat,
      //   lng: $scope.destinationLng
      // }

      $http({
        method: 'GET',
        url: 'http://hw8-result.us-east-2.elasticbeanstalk.com/',
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

    $scope.openFacebookWindow = function()
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
      if ($location.path() == '/details_page')
      {
        $location.path('/results_page');
      }
      else if ($location.path() == '/favoriteDetails_page')
      {
        $location.path('/favorites_page');
      }
    }

    $scope.addToFavorite = function()
    {
      console.log($rootScope.detailWishIconClass);

      if ($rootScope.detailWishIconClass === "material-icons md-18")
      {
        $rootScope.detailWishIconClass = "material-icons md-18 yellow";
        $rootScope.shopping_cart = "remove_shopping_cart";
        $scope.passData = [];
        $scope.passData[0] = $scope.placeDetails;
        // $scope.passData[1] = $scope.photo_arr;
        $scope.savedData[1] = [];
        $scope.savedData[1][0] = $scope.passedKeyword;
        $scope.savedData[1][1] = $scope.placeDetails.ItemID;

        $scope.passData[2] = $rootScope.tempFavoriteRow;
        $scope.passData[3] = $scope.myLocationOption;
        //console.log($scope.myLocationOption);
        if ($scope.myLocationOption === "option1")
        {
          // $scope.passData[4] = $scope.startGeoLocation;
          $scope.savedData[4] = "90007";
        }
        else
        {
          $scope.passData[4] = $scope.myInputLocation;
        }
        var timeStamp = Date.now();
        $scope.passData[5] = timeStamp;
        console.log($scope.passData);
        localStorage.setItem($scope.storageKey, JSON.stringify($scope.passData));
      }
      else
      {
        $rootScope.detailWishIconClass = "material-icons md-18";
        $rootScope.shopping_cart = "add_shopping_cart";
        localStorage.removeItem($scope.placeDetails.ItemID);
      }
    }
  }]);
})(angular);
