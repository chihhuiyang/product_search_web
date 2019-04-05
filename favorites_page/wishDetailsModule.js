
(function(angular) {
  var wishDetailsModule = angular.module('productSearchModel.wishDetailsModule', ['ngRoute', 'ngAnimate']);
  wishDetailsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/favoriteDetails_page', {
      templateUrl: 'details_page/detailsView.html',
      controller: 'favoriteDetailsController'
    });
  }]);

  wishDetailsModule.service('favoriteDetailsDataService', function(favoriteDataService) {
    this.setData = function() {
      favoriteDataService.setData('newVal');
    };
    this.getData = function() {
      return favoriteDataService.getData();
    };
  });

  wishDetailsModule.controller('favoriteDetailsController', ['$scope', '$http', '$rootScope', 'favoriteDetailsDataService', '$location', function($scope, $http, $rootScope, favoriteDetailsDataService, $location) {
    $rootScope.ifSlide = true;
    $rootScope.moveToRight = false;
    $rootScope.detailWishIconClass = "material-icons md-18";
    $rootScope.shopping_cart = "add_shopping_cart";

    $scope.favData = favoriteDetailsDataService.getData();
    console.log($scope.favData);
    console.log($rootScope);
    $scope.storageKey = $scope.favData[0];
    $scope.myLocationOption = $scope.favData[1];
    $scope.singleItemDetail = $scope.favData[3];
    $scope.photo_arr = $scope.favData[4];  // keyword + itemId
    $scope.name = $scope.singleItemDetail.Title;
    console.log(window.localStorage);

    $scope.ifHasPhoto = true;  // initail assign
    $scope.ifHasSimilar = true;  // initail assign


    $scope.currentStorage = window.localStorage;
    for (var i = 0; i < $scope.currentStorage.length; i++) {
      var currentKey = $scope.currentStorage.key(i);
      if (currentKey === $scope.storageKey) {
        $rootScope.detailWishIconClass = "material-icons md-18 yellow";
        $rootScope.shopping_cart = "remove_shopping_cart";
      }
    }

    for (var i = 0; i < $rootScope.favoriteRows.length; i++)  {
      if ($rootScope.favoriteRows[i]['itemId'][0] === $scope.singleItemDetail.ItemID) {
        $rootScope.tempFavoriteRow = $rootScope.favoriteRows[i];
      }
    }


    if ($scope.myLocationOption === "option1") {  // current location

    } else { // TODO : zip code location
      $scope.myInputLocation = $scope.favData[2];
    }


    // assign Product tab
    console.log("assign Product tab");
    if ($scope.singleItemDetail.hasOwnProperty('PictureURL')) {
      $scope.showProductImg = true;
      $scope.ProductImg = $scope.singleItemDetail.PictureURL;
      console.log($scope.ProductImg);
    } else {
      $scope.showProductImg = false;
    }

    if ($scope.singleItemDetail.hasOwnProperty('Subtitle')) {
      $scope.showSubtitle = true;
      $scope.subtitle = $scope.singleItemDetail.Subtitle;
    } else {
      $scope.showSubtitle = false;
    }

    if ($scope.singleItemDetail.hasOwnProperty('CurrentPrice')) {
      if ($scope.singleItemDetail.CurrentPrice.hasOwnProperty('Value')) {
        $scope.showPrice = true;
        $scope.price = $scope.singleItemDetail.CurrentPrice.Value;
      } else {
        $scope.showPrice = false;
      }
    } else {
      $scope.showPrice = false;
    }

    if ($scope.singleItemDetail.hasOwnProperty('Location')) {
      $scope.showLocation = true;
      $scope.productLocation = $scope.singleItemDetail.Location;
      // $scope.ratingWidth = $scope.rating * 10
    } else {
      $scope.showLocation = false;
    }

    if ($scope.singleItemDetail.hasOwnProperty('ReturnPolicy')) {
      if ($scope.singleItemDetail.ReturnPolicy.hasOwnProperty('ReturnsAccepted') && $scope.singleItemDetail.ReturnPolicy.hasOwnProperty('ReturnsWithin')) {
        $scope.showReturnPolicy = true;
        $scope.returnPolicy = $scope.singleItemDetail.ReturnPolicy.ReturnsAccepted + " Within " + $scope.singleItemDetail.ReturnPolicy.ReturnsWithin;
      } else {
        $scope.showReturnPolicy = false;
      }
    } else {
      $scope.showReturnPolicy = false;
    }

    if ($scope.singleItemDetail.hasOwnProperty('ItemSpecifics')) {
      if ($scope.singleItemDetail.ItemSpecifics.hasOwnProperty('NameValueList')) {
        $scope.showItemSpecifics = true;
        $scope.itemSpecList = $scope.singleItemDetail.ItemSpecifics.NameValueList;
      } else {
        $scope.showItemSpecifics = false;
      }
    } else {
      $scope.showItemSpecifics = false;
    }

     // assign seller tab
     console.log("assign seller tab");
     if ($scope.singleItemDetail.Seller.hasOwnProperty('FeedbackScore')) {
      $scope.showFeedbackScore = true;
      $scope.feedbackScore = $scope.singleItemDetail.Seller.FeedbackScore;

      // star color 
      var scores = $scope.feedbackScore;
      if (scores >= 0 && scores < 10000) {
        $scope.overTop = false;
        if (scores >= 0 && scores <= 9) {
          $scope.showFeedbackRatingStar = false;
        } else {
          $scope.showFeedbackRatingStar = true;
        }
      } else {
        $scope.overTop = true;
      }

    } else {
      $scope.showFeedbackScore = false;
    }
    if ($scope.singleItemDetail.Seller.hasOwnProperty('PositiveFeedbackPercent')) {
      $scope.showPopularity = true;
      $scope.popularity = $scope.singleItemDetail.Seller.PositiveFeedbackPercent;
    } else {
      $scope.showPopularity = false;
    }
    if ($scope.singleItemDetail.Seller.hasOwnProperty('FeedbackRatingStar')) {
      // $scope.showFeedbackRatingStar = true; // 1~9
      var color_str = $scope.singleItemDetail.Seller.FeedbackRatingStar;
      color_str = color_str.toLowerCase();
      $scope.starColor = color_str;
    } else {
      $scope.showFeedbackRatingStar = false;
    }
    if ($scope.singleItemDetail.Seller.hasOwnProperty('TopRatedSeller')) {
      $scope.showTopRated = true;
      var toprate = $scope.singleItemDetail.Seller.TopRatedSeller;
      if (toprate == "true") {
        $scope.topRated = true;
      } else {
        $scope.topRated = false;
      }
    } else {
      $scope.showTopRated = false;
    }
  
    if ($scope.singleItemDetail.hasOwnProperty('Storefront')) {
      if ($scope.singleItemDetail.Storefront.hasOwnProperty('StoreName')) {
        $scope.showStoreName = true;
        $scope.storeName = $scope.singleItemDetail.Storefront.StoreName;
      } else {
        $scope.showStoreName = false;
      }
      if ($scope.singleItemDetail.Storefront.hasOwnProperty('StoreURL')) {
        $scope.showBuyProductAt = true;
        $scope.buyProductAt_url = $scope.singleItemDetail.Storefront.StoreURL;
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
      if (items[i].itemId[0] == $scope.singleItemDetail.ItemID) {
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
          var ship = items[i].shippingInfo[0].expeditedShipping[0];
          if (ship == "true") {
            $scope.expeditedShipping = true;
          } else {
            $scope.expeditedShipping = false;
          }        } else {
          $scope.showExpeditedShipping = false;
        }

        if (items[i].shippingInfo[0].hasOwnProperty('oneDayShippingAvailable')) {
          $scope.showOneDayShipping = true;
          var oneday = items[i].shippingInfo[0].oneDayShippingAvailable[0];
          if (oneday == "true") {
            $scope.oneDayShipping = true;
          } else {
            $scope.oneDayShipping = false;
          }        } else {
          $scope.showOneDayShipping = false;
        }

        if (items[i].hasOwnProperty('returnsAccepted')) {
          $scope.showReturnAccepted = true;
          var returnacc = items[i].returnsAccepted[0];
          if (returnacc == "true") {
            $scope.returnAccepted = true;
          } else {
            $scope.returnAccepted = false;
          }
        } else {
          $scope.showReturnAccepted = false;
        }
     
      }
    }


    $scope.checkDisableCondition = function() {
      $scope.mapForm.mapInputLocation.$setPristine();
      $scope.mapForm.mapInputLocation.$setUntouched();
      if ($scope.mapForm.mapInputLocation.$invalid) {
        return true;
      }
    };

    $scope.autoComplete = function() {
      var input = document.getElementById('mapInputLocation');
      var options = {types: ['address']};
      $scope.autocompleteObj = new google.maps.places.Autocomplete(input, options);
    };

    $scope.getReviews = function() {
      $scope.reviewTypeButtonName = "Google Reviews";
      $scope.reviewOrderButtonName = "Default Order";
      $scope.reviewSelection = true;
      if (typeof $scope.singleItemDetail.reviews === 'undefined' || $scope.singleItemDetail.reviews.length === 0)
      {
        $scope.ifHasGoogleReview = false;
      }
      else
      {
        $scope.ifHasGoogleReview = true;
        $scope.googleReviews = $scope.singleItemDetail.reviews;
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



    $scope.setArray = function(params) {
      return new Array(params);
    };

    $scope.getDefaultOrder = function() {
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


    $scope.requestSimilarApi = function() {
      // similar tab
      // ebay similar api ------------------------------
      var inputSimilarData = {
        similar: "true",
        itemId_similar: $scope.singleItemDetail.ItemID
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



    $scope.openFacebookWindow = function() {
      if ($scope.singleItemDetail.hasOwnProperty('ViewItemURLForNaturalSearch')) {
        var placeUrl = $scope.singleItemDetail.ViewItemURLForNaturalSearch;
      } else {
        var placeUrl = "http://www.google.com/";
      }

      var fb_text = "Buy " + $scope.singleItemDetail.Title;;
      fb_text += " at $" + $scope.singleItemDetail.CurrentPrice.Value;
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

    $scope.addToFavorite = function() {
      console.log($rootScope.detailWishIconClass);

      if ($rootScope.detailWishIconClass === "material-icons md-18") {
        $rootScope.detailWishIconClass = "material-icons md-18 yellow";
        $rootScope.shopping_cart = "remove_shopping_cart";
        $scope.passData = [];
        $scope.passData[0] = $scope.singleItemDetail;
        $scope.input_search_single_api_time_Data[1] = [];
        $scope.input_search_single_api_time_Data[1][0] = $scope.passedKeyword;
        $scope.input_search_single_api_time_Data[1][1] = $scope.singleItemDetail.ItemID;

        $scope.passData[2] = $rootScope.tempFavoriteRow;
        $scope.passData[3] = $scope.myLocationOption;
        //console.log($scope.myLocationOption);
        if ($scope.myLocationOption === "option1") {
          $scope.input_search_single_api_time_Data[4] = "90007";
        } else {
          $scope.passData[4] = $scope.myInputLocation;
        }
        var timeStamp = Date.now();
        $scope.passData[5] = timeStamp;
        console.log($scope.passData);
        localStorage.setItem($scope.storageKey, JSON.stringify($scope.passData));
      } else {
        $rootScope.detailWishIconClass = "material-icons md-18";
        $rootScope.shopping_cart = "add_shopping_cart";
        localStorage.removeItem($scope.singleItemDetail.ItemID);
      }
    }
  }]);
})(angular);
