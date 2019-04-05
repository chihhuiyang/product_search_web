
(function(angular)
{
  var detailsModule = angular.module('travelSearchMvc.detailsModule', ['angular-svg-round-progressbar', 'ngRoute', 'ngAnimate']);
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

    // keyword + itemId
    // $scope.placePhotos = $rootScope.passData[1];     // placePhotos => photo_arr
    $scope.passedKeyword = $rootScope.passData[1][0];
    $scope.passedItemId = $rootScope.passData[1][1];
    console.log($scope.passedKeyword);
    console.log($scope.passedItemId);

    $scope.ifHasPhoto = true;  // initail assign
    $scope.ifHasSimilar = true;  // initail assign


    $scope.passedPage = $rootScope.passData[2];
    $scope.passedJsonObj = $rootScope.passData[3];  // ebay search API : [0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item']
    $scope.name = $scope.placeDetails.Title;

    // assign seller tab
    if ($scope.placeDetails.Seller.hasOwnProperty('FeedbackScore')) {
      $scope.showFeedbackScore = true;
      $scope.feedbackScore = $scope.placeDetails.Seller.FeedbackScore;

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
    if ($scope.placeDetails.Seller.hasOwnProperty('PositiveFeedbackPercent')) {
      $scope.showPopularity = true;
      $scope.popularity = $scope.placeDetails.Seller.PositiveFeedbackPercent;
    } else {
      $scope.showPopularity = false;
    }
    if ($scope.placeDetails.Seller.hasOwnProperty('FeedbackRatingStar')) {
      // $scope.showFeedbackRatingStar = true; // 1~9
      var color_str = $scope.placeDetails.Seller.FeedbackRatingStar;
      color_str = color_str.toLowerCase();
      $scope.starColor = color_str;
    } else {
      $scope.showFeedbackRatingStar = false;
    }
    if ($scope.placeDetails.Seller.hasOwnProperty('TopRatedSeller')) {
      $scope.showTopRated = true;
      var toprate = $scope.placeDetails.Seller.TopRatedSeller;
      if (toprate == "true") {
        $scope.topRated = true;
      } else {
        $scope.topRated = false;
      }
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
          var ship = items[i].shippingInfo[0].expeditedShipping[0];
          if (ship == "true") {
            $scope.expeditedShipping = true;
          } else {
            $scope.expeditedShipping = false;
          }
        } else {
          $scope.showExpeditedShipping = false;
        }

        if (items[i].shippingInfo[0].hasOwnProperty('oneDayShippingAvailable')) {
          $scope.showOneDayShipping = true;
          var oneday = items[i].shippingInfo[0].oneDayShippingAvailable[0];
          if (oneday == "true") {
            $scope.oneDayShipping = true;
          } else {
            $scope.oneDayShipping = false;
          }
        } else {
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



    console.log($scope.placeDetails);

    $scope.myLocationOption = $scope.$parent.locationOption;
    if ($scope.myLocationOption === "option1") { // current location

    } else { // TODO : zip code location
      $scope.myInputLocation = $scope.$parent.myInputLocation;
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


    $scope.requestPhotoApi = function() {
      // photo tab
      // google custom search api -----------------------------------
      // if ($scope.ifHasPhoto == false) { // avoid re-call api
        var inputData = {
          keyword_photo: $scope.passedKeyword
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

    $scope.requestSimilarApi = function()  
    {
      // similar tab
      // ebay similar api ------------------------------
      var inputSimilarData = {
        similar: "true",
        itemId_similar: $scope.passedItemId
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
        $rootScope.jsonData[$rootScope.currentPage-1]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex]['wishIconClass'] = $rootScope.detailWishIconClass;
        $rootScope.jsonData[$rootScope.currentPage-1]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex]['shopping_cart'] = $rootScope.shopping_cart;
        var myKey = $scope.passedItemId;
        $scope.savedData = [];
        $scope.savedData[0] = $scope.placeDetails;  // single api response
        $scope.savedData[1] = [];
        $scope.savedData[1][0] = $scope.passedKeyword;
        $scope.savedData[1][1] = $scope.passedItemId;

        $scope.savedData[2] = $rootScope.curRowData;  // ebay search api for this itemId
        $scope.savedData[3] = $scope.myLocationOption;
        console.log($scope.myLocationOption);
        if ($scope.myLocationOption === "option1")
        {
          $scope.savedData[4] = "90007";
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
        $rootScope.jsonData[$rootScope.currentPage-1]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex]['wishIconClass'] = $rootScope.detailWishIconClass;
        $rootScope.jsonData[$rootScope.currentPage-1]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex]['shopping_cart'] = $rootScope.shopping_cart;
        localStorage.removeItem($scope.placeDetails.ItemID);
      }

    }
  }]);
})(angular);
