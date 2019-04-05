
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

    $scope.showPrevious = true;
    $scope.showNext = true;
    if ($scope.userStorage.length === 0) {
      $scope.b_containWishList = false;
    } else {
      $scope.b_containWishList = true;
    }

    // save to wishItems
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
    for (var i = 0; i < $rootScope.wishItems.length && i < 10; i++) {
      $scope.wishData[i] = $rootScope.wishItems[i];
    }


    

    $rootScope.wishPacks = [];
    $rootScope.favoriteCurrentPage = 1;
    $scope.arrangePages = function() {
      $rootScope.totalFavoritePage = ~~($rootScope.wishItems.length / 10) + 1;

      for (var i = 0; i < $rootScope.totalFavoritePage; i++) {
        $rootScope.wishPacks[i] = [];
        for (var j = i * 10; j < 10 * (i+1); j++) {
          if (typeof $rootScope.wishItems[j] !== 'undefined') {
            $rootScope.wishPacks[i].push($rootScope.wishItems[j]);
          }
        }
      }
    }

    $scope.arrangePages();
    console.log($rootScope.wishPacks);
    $scope.numOfFavorite = ($rootScope.totalFavoritePage-1) * 10 + $rootScope.wishPacks[$rootScope.totalFavoritePage-1].length;
    if ($rootScope.favoriteCurrentPage === 1) {
      if ($scope.numOfFavorite <= 20) {
        $scope.showPrevious = false;
        $scope.showNext = false;
      } else {
        $scope.showPrevious = false;
        $scope.showNext = true;
      }
    }

    $scope.getNextPage = function() {
      if ($rootScope.favoriteCurrentPage === 1)
      {
        if ($scope.numOfFavorite <= 10)
        {
          $scope.showPrevious = false;
          $scope.showNext = false;
        }
        else
        {
          $scope.showPrevious = true;
          $scope.showNext = true;
        }
        $scope.wishData = $rootScope.wishPacks[$rootScope.favoriteCurrentPage];
        $rootScope.favoriteCurrentPage++;
        if ($rootScope.favoriteCurrentPage === $rootScope.totalFavoritePage)
        {
          $scope.showPrevious = true;
          $scope.showNext = false;
        }
      }
      else
      {
        $scope.showPrevious = true;
        $scope.showNext = true;
        $scope.wishData = $rootScope.wishPacks[$rootScope.favoriteCurrentPage];
        $rootScope.favoriteCurrentPage++;
        if ($rootScope.favoriteCurrentPage === $rootScope.totalFavoritePage)
        {
          $scope.showPrevious = true;
          $scope.showNext = false;
        }
      }
    }

    $scope.getPreviousPage = function()
    {
      if ($rootScope.favoriteCurrentPage === 2)
      {
        $scope.showPrevious = false;
        $scope.showNext = true;
      }
      else
      {
        $scope.showPrevious = true;
        $scope.showNext = true;
      }
      $rootScope.favoriteCurrentPage--;
      $scope.wishData = $rootScope.wishPacks[$rootScope.favoriteCurrentPage-1];
    }

    $scope.removeLocalStorage = function(index) {
      var deleteIndex = ($rootScope.favoriteCurrentPage-1)*10 + index;
      var deleteKey = $rootScope.wishItems[deleteIndex]['itemId'][0];
      $rootScope.wishItems.splice(deleteIndex, 1);
      $scope.arrangePages();
      $scope.wishData = $rootScope.wishPacks[$rootScope.favoriteCurrentPage-1];

      if (index === 0 && $rootScope.favoriteCurrentPage !== 1
        && ($rootScope.wishPacks[[$rootScope.favoriteCurrentPage-1]].length === 0)) {
        $scope.getPreviousPage();
      }
      if ($rootScope.wishItems.length === 0) {
        $scope.b_containWishList = false;
      } else {
        $scope.b_containWishList = true;
      }

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


      $scope.showPrevious = false;
      $scope.showNext = false;
      // if ($rootScope.wishItems.length <= 40 && $rootScope.wishItems.length > 20 && $rootScope.favoriteCurrentPage !== 1)
      // {
      //   $scope.showPrevious = true;
      //   $scope.showNext = false;
      // }
      // if ($rootScope.wishItems.length <= 20)
      // {
      //   $scope.showPrevious = false;
      //   $scope.showNext = false;
      // }
      $rootScope.detailWishIconClass = "material-icons md-18";
      $rootScope.shopping_cart = "add_shopping_cart";
      localStorage.removeItem(deleteKey);
    }

    $scope.sendKey = function(index) {
      $rootScope.b_slide = true;

      //console.log($rootScope.wishItems);
      var sendIndex = ($rootScope.favoriteCurrentPage-1)*20 + index;
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
      $rootScope.favoriteRowIndex = sendIndex;
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
