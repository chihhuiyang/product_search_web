
(function(angular) {
  var detailsModule = angular.module('productSearchModel.detailsModule', ['angular-svg-round-progressbar', 'ngRoute', 'ngAnimate']);
  detailsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/details_page', {
      templateUrl: 'details_page/detailsPage.html',
      controller: 'detailsController'
    });
  }]);

  detailsModule.service('detailsDataService', function(resultsDataService) {
    this.setData = function(newVal) {
      resultsDataService.setData(newVal);
    };
    this.getData = function() {
      return resultsDataService.getData();
    };
  });

  detailsModule.controller('detailsController', ['$scope', '$http', '$rootScope', 'detailsDataService', '$location', function($scope, $http, $rootScope, detailsDataService, $location) {
    

    $rootScope.b_rightMotion = false;
    $rootScope.detailWishIconClass = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex].wishIconClass;
    $rootScope.shopping_cart = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex].shopping_cart;
    if (typeof $rootScope.passData === 'undefined' || (detailsDataService.getData().length === 4 && detailsDataService.getData() !== $rootScope.passData))
    {
      $rootScope.passData = detailsDataService.getData();
    }
    console.log($rootScope.passData);
    $scope.singleItemDetail = $rootScope.passData[0];

    // keyword + itemId
    $scope.passedKeyword = $rootScope.passData[1][0];
    $scope.passedItemId = $rootScope.passData[1][1];
    $scope.passedTitle = $scope.singleItemDetail.Title;
    console.log($scope.passedKeyword);
    console.log($scope.passedItemId);

    $scope.b_containPhoto = true;  // initail assign
    $scope.b_containSimilar = true;  // initail assign


      // photo tab
      // google custom search api -----------------------------------
      var inputData = {
        //  keyword_photo: $scope.passedKeyword
        keyword_photo: $scope.passedTitle
      }
      console.log(inputData);
      $http({
        method: 'GET',
        // url: "http://localhost:8081/?",
        url: 'http://chihhuiy-nodejs.us-east-2.elasticbeanstalk.com/?',
        params: inputData
      })
      .then (function (response) {
        console.log("photo api response");
        $scope.photo_items = response.data.items;
        console.log($scope.photo_items);
        $scope.b_containPhoto = false;
        if (typeof $scope.photo_items !== 'undefined') {
          $scope.photo_arr = [];
          for (var i = 0; i < $scope.photo_items.length; i++) {
            var photo_url = $scope.photo_items[i].link;
            $scope.photo_arr[i] = photo_url;
            $scope.b_containPhoto = true;
          }
          console.log($scope.photo_arr);
        }
      },
      function(response)
      {
        console.error("google photo api request error!!!");
        $rootScope.showProgressBar = false;
        $scope.b_containPhoto = false;
      });




    $scope.transferPage = $rootScope.passData[2];
    $scope.firstApiJson = $rootScope.passData[3];  // ebay search API : [0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item']
    $scope.name = $scope.singleItemDetail.Title;

    // assign seller tab
    if ($scope.singleItemDetail.Seller.hasOwnProperty('UserID')) {
      $scope.showUserId = true;
      var str = $scope.singleItemDetail.Seller.UserID;
      $scope.user_id = str.toUpperCase();
    } else {
      $scope.showUserId = false;
    }

    if ($scope.singleItemDetail.Seller.hasOwnProperty('FeedbackScore')) {
      $scope.showFeedbackScore = true;
      $scope.feedbackScore = $scope.singleItemDetail.Seller.FeedbackScore;
      console.log("show FeedbackScore");
      // star color 
      var scores = $scope.feedbackScore;
      if (scores >= 0 && scores < 10000) {
          $scope.overTop = false;
          if (scores >= 0 && scores <= 9) {
            $scope.showFeedbackRatingStar = false;
          } else {
            $scope.showFeedbackRatingStar = true;
            if (scores >= 10 && scores < 50) {
              $scope.starColor = "yellow";
            } else if (scores >= 50 && scores < 100) {
              $scope.starColor = "blue";
            } else if (scores >= 100 && scores < 500) {
              $scope.starColor = "turquoise";
            } else if (scores >= 500 && scores < 1000) {
              $scope.starColor = "purple";
            } else if (scores >= 1000 && scores < 5000) {
              $scope.starColor = "red";
            } else if (scores >= 5000 && scores < 10000) {
              $scope.starColor = "green";
            }
            console.log($scope.starColor);
          }
      } else { // scores >= 10000
          $scope.overTop = true;

          $scope.showFeedbackRatingStar = true;
          if (scores >= 10000 && scores < 25000) {
            $scope.starColor = "yellow";
          } else if (scores >= 25000 && scores < 50000) {
            $scope.starColor = "turquoise";
          } else if (scores >= 50000 && scores < 100000) {
            $scope.starColor = "purple";
          } else if (scores >= 100000 && scores < 500000) {
            $scope.starColor = "red";
          } else if (scores >= 500000 && scores < 1000000) {
            $scope.starColor = "green";
          } else if (scores >= 1000000) {
            $scope.starColor = "silver";
          }
          console.log($scope.starColor);
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
      // implement in FeedbackScore
    } else {
      $scope.showFeedbackRatingStar = false;
    }
    if ($scope.singleItemDetail.Seller.hasOwnProperty('TopRatedSeller')) {
      $scope.showTopRated = true;
      var toprate = $scope.singleItemDetail.Seller.TopRatedSeller;
      if (toprate) {
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
    var items = $scope.firstApiJson[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
    for (var i = 0; i < items.length; i++) {
      if (items[i].itemId[0] == $scope.singleItemDetail.ItemID) {
        // console.log(items[i].itemId[0]);

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

        console.log(items[i].shippingInfo[0]);
        if (items[i].shippingInfo[0].hasOwnProperty('shipToLocations')) {
          $scope.showShippingLocation = true;
          $scope.shippingLocation = items[i].shippingInfo[0].shipToLocations[0];
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

    // console.log($scope.singleItemDetail);

    $scope.myLocationOption = $scope.$parent.locationOption;
    if ($scope.myLocationOption === "option1") { // current location
      $scope.myInputLocation = "";
    } else { // zip code location
      $scope.myInputLocation = $scope.$parent.myInputLocation;
    }


    // assign Product tab
    console.log("assign Product tab");
    if ($scope.singleItemDetail.hasOwnProperty('PictureURL')) {
      $scope.showProductImg = true;
      $scope.ProductImg = $scope.singleItemDetail.PictureURL;
      console.log("show PictureURL");
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
        // url: "http://localhost:8081/?",
        url: 'http://chihhuiy-nodejs.us-east-2.elasticbeanstalk.com/?',
        params: inputSimilarData
      })
      .then (function (response) {
        console.log("similar api response");
        console.log(response);
        $scope.similar_items = response.data.getSimilarItemsResponse.itemRecommendations.item;
        console.log($scope.similar_items);


        // set initial value
        $scope.mySortMethod_option = "simi_defalt";
        $scope.mySortDirection_option = "simi_ascending";


        if (typeof $scope.similar_items === 'undefined' || $scope.similar_items.length === 0) {
          console.log("no similar items");
          $scope.b_containSimilar = false;
        } else {
          $scope.b_containSimilar = true;
          $scope.similar_items_arr = $scope.similar_items;

          // display show more / show less button
          if ($scope.similar_items.length > 5) {
            $scope.similarItemOverFive = true;
            $scope.txt_showMoreLess = "Show More";
          } else {
            $scope.similarItemOverFive = false;
          }


          // update timeLeft value
          for (var i = 0; i < $scope.similar_items.length; i++) {
             var timeLeft_str = $scope.similar_items[i]['timeLeft'];
             var a = timeLeft_str.indexOf("P");
             var b = timeLeft_str.indexOf("D");
             $scope.similar_items_arr[i]['timeLeft'] = timeLeft_str.substring(a+1, b);
          }


          // show top 5 rows at first
          for (var i = 0; i < $scope.similar_items.length; i++) {
             if (i < 5) {
              $scope.similar_items_arr[i]['showRow'] = true;
             } else {
              $scope.similar_items_arr[i]['showRow'] = false;
             }
          }

          // deep copy arr
          $scope.similar_items_arr_default_order = [];
          for (var i = 0; i < $scope.similar_items_arr.length; i++) {
            $scope.similar_items_arr_default_order.push($scope.similar_items_arr[i]);
          }
          console.log($scope.similar_items_arr_default_order);

          // deep copy arr
          $scope.similar_items_arr_default_order_reverse = [];
          for (var i = 0; i < $scope.similar_items_arr.length; i++) {
            $scope.similar_items_arr_default_order_reverse.push($scope.similar_items_arr[i]);
          }
          $scope.similar_items_arr_default_order_reverse.reverse();
          console.log($scope.similar_items_arr_default_order_reverse);

        }
        // console.log("end");
      },
      function(response)
      {
        console.error("similar api request error!!!");
        $rootScope.showProgressBar = false;
        $scope.b_containSimilar = false;
      });

    };



    $scope.sort = function() {
      // console.log("sort_start");


      // console.log($scope.mySortDirection_option);
      // console.log($scope.mySortMethod_option);

      if ($scope.mySortDirection_option === "simi_ascending") {
        console.log("^");
        if ($scope.mySortMethod_option === "simi_defalt") {
          // console.log("default+ascending");
          $scope.similar_items_arr = $scope.similar_items_arr_default_order;
        } else if ($scope.mySortMethod_option === "simi_name") {
          // console.log("name+ascending");
          $scope.similar_items_arr.sort(function(x, y) {
            return (x.title).localeCompare(y.title);
          });
        } else if ($scope.mySortMethod_option === "simi_days") {
          // console.log("days+ascending");
          $scope.similar_items_arr.sort(function(x, y) {
            return parseInt(x.timeLeft) - parseInt(y.timeLeft);
          });
        } else if ($scope.mySortMethod_option === "simi_price") {
          // console.log("price+ascending");
          $scope.similar_items_arr.sort(function(x, y) {
            return parseFloat(x.buyItNowPrice.__value__) - parseFloat(y.buyItNowPrice.__value__);
          });
        } else if ($scope.mySortMethod_option === "simi_cost") {
          // console.log("cost+ascending");
          $scope.similar_items_arr.sort(function(x, y) {
            return parseFloat(x.shippingCost.__value__) - parseFloat(y.shippingCost.__value__);
          });
        }
      } else {  // $scope.mySortDirection_option == "simi_descending"
        console.log("V");
        if ($scope.mySortMethod_option === "simi_defalt") {
          // console.log("default+descending");
          $scope.similar_items_arr = $scope.similar_items_arr_default_order_reverse;

        } else if ($scope.mySortMethod_option === "simi_name") {
          // console.log("name+descending");
          $scope.similar_items_arr.sort(function(x, y) {
            return (y.title).localeCompare(x.title);
          });
        } else if ($scope.mySortMethod_option === "simi_days") {
          // console.log("days+descending");
          $scope.similar_items_arr.sort(function(x, y) {
            return parseInt(y.timeLeft) - parseInt(x.timeLeft);
          });
        } else if ($scope.mySortMethod_option === "simi_price") {
          // console.log("price+descending");
          $scope.similar_items_arr.sort(function(x, y) {
            return parseFloat(y.buyItNowPrice.__value__) - parseFloat(x.buyItNowPrice.__value__);
          });
        } else if ($scope.mySortMethod_option === "simi_cost") {
          // console.log("cost+descending");
          $scope.similar_items_arr.sort(function(x, y) {
            return parseFloat(y.shippingCost.__value__) - parseFloat(x.shippingCost.__value__);
          });
        }
      }


      // update to sorted arr
      if ($scope.txt_showMoreLess === "Show Less") {
        // current is More
        for (var i = 0; i < $scope.similar_items.length; i++) {
          if (i < 5) {
            $scope.similar_items_arr[i]['showRow'] = true;
          } else {
            $scope.similar_items_arr[i]['showRow'] = true;
          }
        }
      } else {
        // current is Less
        for (var i = 0; i < $scope.similar_items.length; i++) {
          if (i < 5) {
            $scope.similar_items_arr[i]['showRow'] = true;
          } else {
            $scope.similar_items_arr[i]['showRow'] = false;
          }
        }
      }

      // console.log("sort end");
    }



    $scope.showMoreLess = function() {
      if ($scope.txt_showMoreLess === "Show More") {
        $scope.txt_showMoreLess = "Show Less";

        for (var i = 0; i < $scope.similar_items_arr.length; i++) {
          if (i >= 5) {
            $scope.similar_items_arr[i]['showRow'] = true;
          } else {
            $scope.similar_items_arr[i]['showRow'] = true;
          }
        }
      } else {
        $scope.txt_showMoreLess = "Show More";

        for (var i = 0; i < $scope.similar_items_arr.length; i++) {
          if (i >= 5) {
            $scope.similar_items_arr[i]['showRow'] = false;
          } else {
            $scope.similar_items_arr[i]['showRow'] = true;
          }
        }
      } 
    }


    $scope.backToList = function() {
      $rootScope.b_flip = true;
      $rootScope.b_rightMotion = false;
      if ($location.path() === '/details_page') {
        $scope.transferDataToProductPage = [];
        $scope.transferDataToProductPage[0] = $scope.transferPage;
        $scope.transferDataToProductPage[1] = $scope.firstApiJson;
        detailsDataService.setData($scope.transferDataToProductPage);
        window.history.back();
      } else if ($location.path() === '/wishDetails_page') {
        console.log("To location: " + "/wish_page");
        $location.path('/wish_page');
      }
    }


    $scope.openFacebookWindow = function() {
      if ($scope.singleItemDetail.hasOwnProperty('ViewItemURLForNaturalSearch')) {
        var dest_url = $scope.singleItemDetail.ViewItemURLForNaturalSearch;
      } else {
        var dest_url = "http://www.google.com/";
      }

      var fb_text = "Buy " + $scope.singleItemDetail.Title;;
      fb_text += " at $" + $scope.singleItemDetail.CurrentPrice.Value;
      fb_text += " from LINK below.";
      var fb_url = "https://www.facebook.com/dialog/share?app_id=412937185919670&display=popup&href=" + dest_url + "&quote=" + fb_text;
      $scope.facebookWindow = window.open(fb_url, "Share a link on Facebook");
    };


    $scope.requestPhotoApi = function() {
        var inputData = {
          // keyword_photo: $scope.passedKeyword
          keyword_photo: $scope.passedTitle
        }
        console.log(inputData);
        $http({
          method: 'GET',
          // url: "http://localhost:8081/?",
          url: 'http://chihhuiy-nodejs.us-east-2.elasticbeanstalk.com/?',
          params: inputData
        })
        .then (function (response) {
          console.log("photo api response");
          $scope.photo_items = response.data.items;
          console.log($scope.photo_items);
          $scope.b_containPhoto = false;
          if (typeof $scope.photo_items !== 'undefined') {
            $scope.photo_arr = [];
            for (var i = 0; i < $scope.photo_items.length; i++) {
              var photo_url = $scope.photo_items[i].link;
              $scope.photo_arr[i] = photo_url;
              $scope.b_containPhoto = true;
            }
            console.log($scope.photo_arr);
          }
        },
        function(response)
        {
          console.error("google photo api request error!!!");
          $rootScope.showProgressBar = false;
          $scope.b_containPhoto = false;
        });
    };

    window.onclick = function(event) {
      var modal = document.getElementById('myModal');
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    $scope.popup = function() {
      var modal = document.getElementById('myModal');
      if (modal.style.display === "block") {
        modal.style.display = "none";
      } else {
      modal.style.display = "block";
      }
    };


    $scope.addToWishList = function() {
      console.log("details - add to wish list");
      if ($rootScope.detailWishIconClass === "material-icons md-18") {
        // console.log("update product icon : to yellow");
        $rootScope.detailWishIconClass = "material-icons md-18 yellow";
        $rootScope.shopping_cart = "remove_shopping_cart";
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex]['wishIconClass'] = $rootScope.detailWishIconClass;
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex]['shopping_cart'] = $rootScope.shopping_cart;
        var myKey = $scope.passedItemId;
        $scope.input_search_single_api_time_Data = [];
        $scope.input_search_single_api_time_Data[0] = $scope.singleItemDetail;  // single api response
        $scope.input_search_single_api_time_Data[1] = [];
        $scope.input_search_single_api_time_Data[1][0] = $scope.passedKeyword;
        $scope.input_search_single_api_time_Data[1][1] = $scope.passedItemId;
        
        $scope.input_search_single_api_time_Data[2] = $rootScope.curRowData;  // ebay search api for this itemId
        $scope.input_search_single_api_time_Data[3] = $scope.myLocationOption;

        if ($scope.myLocationOption === "option1") {
          $scope.input_search_single_api_time_Data[4] = "";
        } else {
          $scope.input_search_single_api_time_Data[4] = $scope.myInputLocation;
        }
        var timeStamp = Date.now();
        $scope.input_search_single_api_time_Data[5] = timeStamp;
        localStorage.setItem(myKey, JSON.stringify($scope.input_search_single_api_time_Data));
      } else {  // current is yellow
        // console.log("update product icon : to blank");
        $rootScope.detailWishIconClass = "material-icons md-18";
        $rootScope.shopping_cart = "add_shopping_cart";
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex]['wishIconClass'] = $rootScope.detailWishIconClass;
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][$rootScope.currentIndex]['shopping_cart'] = $rootScope.shopping_cart;
        localStorage.removeItem($scope.singleItemDetail.ItemID);
      }

    }
  }]);
})(angular);
