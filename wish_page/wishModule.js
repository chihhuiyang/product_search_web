
(function(angular) {
  var wishModule = angular.module('productSearchModel.wishModule', ['ngRoute']);
  wishModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/wish_page', {
      templateUrl: 'wish_page/wishPage.html',
      controller: 'wishController'
    });
  }]);

  wishModule.service('favoriteDataService', function() {
    this.setData = function(val) {
      this.myData = val;
    };
    this.getData = function() {
      return this.myData;
    };
  });

  wishModule.controller('wishController', ['$scope', '$http', '$rootScope', '$location', 'favoriteDataService', '$q', function($scope, $http, $rootScope, $location, favoriteDataService, $q) {
    console.log($rootScope);
    console.log($scope);

    $rootScope.moveToRight = true;
    $scope.userStorage = window.localStorage;
    $scope.sorted_localStorage = [];
    var copy_key;
    var copy_arr;
    for (var i = 0; i < $scope.userStorage.length; i++) {
      copy_key = $scope.userStorage.key(i);
      copy_arr = JSON.parse(localStorage.getItem(copy_key));
      copy_arr[6] = copy_key;
      $scope.sorted_localStorage.push(copy_arr);
    }

    $scope.sorted_localStorage.sort(function(x, y) {
      return x[5] - y[5]; // sort by time
    })

    console.log($scope.sorted_localStorage);

    if ($scope.userStorage.length === 0) {
      $scope.b_containWishList = false;
    } else {
      $scope.b_containWishList = true;
    }

    // save to root
    $rootScope.wishItems = [];
    for (var i = 0; i < $scope.sorted_localStorage.length; i++) {
      $rootScope.wishItems.push($scope.sorted_localStorage[i][2]);
    }
    for (var i = 0; i < $rootScope.wishItems.length; i++) {
      $rootScope.wishItems[i]['b_picked'] = false;
      if ($rootScope.wishItems[i]['itemId'][0] === $rootScope.savedKey) {
        console.log($rootScope.wishItems[i]);
        $rootScope.wishItems[i]['b_picked'] = true;
      }
    }

    $scope.wishData = [];
    for (var i = 0; i < $rootScope.wishItems.length; i++) {
      $scope.wishData[i] = $rootScope.wishItems[i];
    }
    console.log($scope.wishData);


      // calculate total_shopping_price
      var total_price = 0;
      for (var i = 0; i < $scope.wishData.length; i++) {
          var price_str = $scope.wishData[i]['sellingStatus'][0]['currentPrice'][0]['__value__'];
          var price = parseFloat(price_str);
          total_price += price;
      }
      $scope.total_shopping_price = total_price;


    // save to root
    $rootScope.wishPacks = [];
    $rootScope.wish_cur_page_no = 1;
    $rootScope.count_total_wish_pages = 1;
    $rootScope.wishPacks[0] = [];
    for (var i = 0; i < $rootScope.wishItems.length; i++) {
      if (typeof $rootScope.wishItems[i] !== 'undefined') {
        $rootScope.wishPacks[0].push($rootScope.wishItems[i]);
      }
    }

    console.log($rootScope.wishPacks);
    $scope.numOfFavorite = $rootScope.wishPacks[0].length;


    $scope.removeLocalStorage = function(index) {
      console.log("remove item: " + index);
      var deleteIndex = index;
      var deleteKey = $rootScope.wishItems[deleteIndex]['itemId'][0];
      $rootScope.wishItems.splice(deleteIndex, 1);
      
      
      $rootScope.count_total_wish_pages = 1;
      $rootScope.wishPacks[0] = [];
      for (var i = 0; i < $rootScope.wishItems.length; i++) {
        if (typeof $rootScope.wishItems[i] !== 'undefined') {
          $rootScope.wishPacks[0].push($rootScope.wishItems[i]);
        }
      }

      $scope.wishData = $rootScope.wishPacks[0]; 
      console.log($scope.wishData);
      console.log($rootScope.wishPacks[0]);
      if ($rootScope.wishItems.length === 0) {
        $scope.b_containWishList = false;
      } else {
        $scope.b_containWishList = true;
      }

      // calculate total_shopping_price
      var total_price = 0;
      for (var i = 0; i < $scope.wishData.length; i++) {
          var price_str = $scope.wishData[i]['sellingStatus'][0]['currentPrice'][0]['__value__'];
          var price = parseFloat(price_str);
          total_price += price;
      }
      $scope.total_shopping_price = total_price;



      // update product page data
      if (typeof $rootScope.jsonData !== 'undefined') {
        for (var i = 0; i < $rootScope.jsonData.length; i++) {
          var items = $rootScope.jsonData[i]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
          for (var j = 0; j < items.length; j++) {
            if (items[j]['itemId'][0] === $scope.sorted_localStorage[deleteIndex][6]) {
              items[j]['ifSaved'] = false;
              items[j]['wishIconClass'] = "material-icons md-18";
              items[j]['shopping_cart'] = "add_shopping_cart";
            }
          }
        }
      }

      $rootScope.detailWishIconClass = "material-icons md-18";
      $rootScope.shopping_cart = "add_shopping_cart";
      localStorage.removeItem(deleteKey);
    }

    $scope.sendKey = function(index) {
      $rootScope.b_slide = true;

      //console.log($rootScope.wishItems);
      var sendIndex = index;
      var myKey = $rootScope.wishItems[sendIndex]['itemId'][0];
      var parsedData = JSON.parse(localStorage.getItem(myKey));
      console.log(localStorage);
      console.log(myKey);
      console.log(parsedData);    // parsedData[2]: ebay search api for this item
      var myLocationOption = parsedData[3];
      var locationInfo = parsedData[4];
      $scope.favData = [];
      $scope.favData[0] = myKey;
      $scope.favData[1] = myLocationOption;
      $scope.favData[2] = locationInfo;
      $scope.favData[3] = JSON.parse(localStorage.getItem(myKey))[0];
      $scope.favData[4] = JSON.parse(localStorage.getItem(myKey))[1];

      
      $scope.favData[5] = parsedData[2]; // parsedData[2]: ebay search api for this itemId

      //console.log($scope.favData);
      favoriteDataService.setData($scope.favData);
      $rootScope.b_clickDetail = false;
      $rootScope.b_clickWishDetail = true;
      for (var i = 0; i < $rootScope.wishItems.length; i++) {
        $rootScope.wishItems[i]['b_picked'] = false;
      }
      $rootScope.wishItems[sendIndex]['b_picked'] = true;
      $rootScope.savedKey = $rootScope.wishItems[sendIndex]['itemId'][0];
    }

    $scope.redirect = function(myPath) {
      console.log("redirect to:" + myPath);
      $location.path(myPath);
    };

    $scope.redirectFavoriteDetailsPage = function() {
      console.log("redirectFavoriteDetailsPage");
      $rootScope.b_slide = true;
      $rootScope.moveToRight = true;
      if ($location.path() === '/wish_page' && $rootScope.b_clickWishDetail === true)
      {
        console.log("favoriteDetails_page");
        $location.path('/favoriteDetails_page');
      }
      else
      {
        console.log("details_page");
        $location.path('/details_page');
      }
    }

    $scope.addAnimation = function() {
      $rootScope.b_slide = true;
    }
  }]);
})(angular);
