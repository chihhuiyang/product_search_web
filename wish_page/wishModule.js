
(function(angular) {
  var wishModule = angular.module('productSearchModel.wishModule', ['ngRoute']);
  wishModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/wish_page', {
      templateUrl: 'wish_page/wishPage.html',
      controller: 'favoritesController'
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

  wishModule.controller('favoritesController', ['$scope', '$http', '$rootScope', '$location', 'favoriteDataService', '$q', function($scope, $http, $rootScope, $location, favoriteDataService, $q) {
    console.log($rootScope);
    console.log($scope);

    //localStorage.clear();
    $rootScope.moveToRight = true;
    $scope.myStorage = window.localStorage;
    $scope.sortedStorage = [];
    var copy_key;
    var copy_arr;
    for (var i = 0; i < $scope.myStorage.length; i++) {
      copy_key = $scope.myStorage.key(i);
      copy_arr = JSON.parse(localStorage.getItem(copy_key));
      copy_arr[6] = copy_key;
      $scope.sortedStorage.push(copy_arr);
    }

    $scope.sortedStorage.sort(function(x, y) {
      return x[5] - y[5]; // sort by time
    })

    console.log($scope.sortedStorage);

    $scope.showPrevious = true;
    $scope.showNext = true;
    if ($scope.myStorage.length === 0) {
      $scope.ifHasFavoriteItems = false;
    } else {
      $scope.ifHasFavoriteItems = true;
    }

    $rootScope.favoriteRows = [];
    for (var i = 0; i < $scope.sortedStorage.length; i++) {
      $rootScope.favoriteRows.push($scope.sortedStorage[i][2]);
    }
    for (var i = 0; i < $rootScope.favoriteRows.length; i++) {
      $rootScope.favoriteRows[i]['ifHighlight'] = false;
      if ($rootScope.favoriteRows[i]['itemId'][0] === $rootScope.savedKey) {
        console.log($rootScope.favoriteRows[i]);
        $rootScope.favoriteRows[i]['ifHighlight'] = true;
      }
    }

    $scope.favoriteRowData = [];
    for (var i = 0; i < $rootScope.favoriteRows.length && i < 10; i++) {
      $scope.favoriteRowData[i] = $rootScope.favoriteRows[i];
    }

    $rootScope.allFavoriteData = [];
    $rootScope.favoriteCurrentPage = 1;
    $scope.arrangePages = function() {
      $rootScope.totalFavoritePage = ~~($rootScope.favoriteRows.length / 10) + 1;

      for (var i = 0; i < $rootScope.totalFavoritePage; i++) {
        $rootScope.allFavoriteData[i] = [];
        for (var j = i * 10; j < 10 * (i+1); j++) {
          if (typeof $rootScope.favoriteRows[j] !== 'undefined') {
            $rootScope.allFavoriteData[i].push($rootScope.favoriteRows[j]);
          }
        }
      }
    }

    $scope.arrangePages();
    console.log($rootScope.allFavoriteData);
    $scope.numOfFavorite = ($rootScope.totalFavoritePage-1) * 10 + $rootScope.allFavoriteData[$rootScope.totalFavoritePage-1].length;
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
        $scope.favoriteRowData = $rootScope.allFavoriteData[$rootScope.favoriteCurrentPage];
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
        $scope.favoriteRowData = $rootScope.allFavoriteData[$rootScope.favoriteCurrentPage];
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
      $scope.favoriteRowData = $rootScope.allFavoriteData[$rootScope.favoriteCurrentPage-1];
    }

    $scope.removeLocalStorage = function(index) {
      var deleteIndex = ($rootScope.favoriteCurrentPage-1)*10 + index;
      var deleteKey = $rootScope.favoriteRows[deleteIndex]['itemId'][0];
      $rootScope.favoriteRows.splice(deleteIndex, 1);
      $scope.arrangePages();
      $scope.favoriteRowData = $rootScope.allFavoriteData[$rootScope.favoriteCurrentPage-1];

      if (index === 0 && $rootScope.favoriteCurrentPage !== 1
        && ($rootScope.allFavoriteData[[$rootScope.favoriteCurrentPage-1]].length === 0)) {
        $scope.getPreviousPage();
      }
      if ($rootScope.favoriteRows.length === 0) {
        $scope.ifHasFavoriteItems = false;
      } else {
        $scope.ifHasFavoriteItems = true;
      }

      if (typeof $rootScope.jsonData !== 'undefined') {
        for (var i = 0; i < $rootScope.jsonData.length; i++) {
          var items = $rootScope.jsonData[i]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
          for (var j = 0; j < items.length; j++) {
            if (items[j]['itemId'][0] === $scope.sortedStorage[deleteIndex][6]) {
              items[j]['ifSaved'] = false;
              items[j]['wishIconClass'] = "material-icons md-18";
              items[j]['shopping_cart'] = "add_shopping_cart";
            }
          }
        }
      }


      $scope.showPrevious = false;
      $scope.showNext = false;
      // if ($rootScope.favoriteRows.length <= 40 && $rootScope.favoriteRows.length > 20 && $rootScope.favoriteCurrentPage !== 1)
      // {
      //   $scope.showPrevious = true;
      //   $scope.showNext = false;
      // }
      // if ($rootScope.favoriteRows.length <= 20)
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

      //console.log($rootScope.favoriteRows);
      var sendIndex = ($rootScope.favoriteCurrentPage-1)*20 + index;
      var myKey = $rootScope.favoriteRows[sendIndex]['itemId'][0];
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
      for (var i = 0; i < $rootScope.favoriteRows.length; i++) {
        $rootScope.favoriteRows[i]['ifHighlight'] = false;
      }
      $rootScope.favoriteRows[sendIndex]['ifHighlight'] = true;
      $rootScope.savedKey = $rootScope.favoriteRows[sendIndex]['itemId'][0];
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
