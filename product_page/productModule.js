
(function(angular) {
  var productModule = angular.module('productSearchModel.productModule', ['angular-svg-round-progressbar', 'ngRoute']);
  productModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/product_page', {
      templateUrl: 'product_page/productPage.html',
      controller: 'productController'
    });
  }]);

  productModule.service('resultsDataService', function() {
    this.setData = function(val)
    {
      this.myData = val;
    };
    this.getData = function()
    {
      return this.myData;
    };
  });

  productModule.controller('productController', ['$scope', '$http', '$rootScope', '$location', 'resultsDataService', '$q', function($scope, $http, $rootScope, $location, resultsDataService, $q) {
    $rootScope.b_slide = false;
    $rootScope.moveToRight = true;
    $scope.myLocationOption = $scope.$parent.locationOption;
    $scope.showResultsTable = $scope.$parent.showTable;
    $scope.userStorage = window.localStorage;

    $scope.myKeywordData = $scope.$parent.myKeyword;
    console.log($scope.myKeywordData);

    var storageKey;

    if (typeof resultsDataService.getData() !== 'undefined' && resultsDataService.getData()[1][0] === $scope.$parent.jsonObj) {
      // ebay search api
      $scope.ifHasTable = true;
      $rootScope.currentPage = resultsDataService.getData()[0];
      console.log($rootScope.currentPage);
      $rootScope.jsonData = resultsDataService.getData()[1];
      console.log($rootScope.jsonData);
      for (var i = 0; i < $rootScope.jsonData.length; i++) {
        console.log(i);
        for (j = 0; j < $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'].length; j++) {
          if (typeof $rootScope.jsonData[i] !== 'undefined') {
            $rootScope.jsonData[i]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][j]['b_picked'] = false;
          }
        }
      }
      for (var i = 0; i < $rootScope.jsonData.length; i++) {
        for (j = 0; j < $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'].length; j++) {
          if ($rootScope.jsonData[i]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][j]['itemId'][0] === $rootScope.savedKey) {
            $rootScope.jsonData[i]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][j]['b_picked'] = true;
          }
        }
      }
      $scope.rowData = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
      $scope.showNext = true;
      $scope.showPrevious = true;
      
    } else {
      $rootScope.jsonData = [];
      $rootScope.jsonData[0] = $scope.$parent.jsonObj;
      $rootScope.currentPage = 1;

      // ebay search api
      if ($rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'] == null) { // null searchResult
        // No Records have been found
        $scope.ifHasTable = false;
      } else {  // valid item
        var count_items = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'].length;
        if (count_items == 0) {
          // No Records have been found
          $scope.ifHasTable = false;
        } else {
          $scope.ifHasTable = true;
          // next, previous show all the time
          $scope.showNext = true;
          $scope.showPrevious = true;

          console.log($rootScope.jsonData);

          $scope.rowData = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];

         
          
          // short title
          for (var i = 0; i < $scope.rowData.length; i++) {
            $scope.rowData[i]['short_title'] = $scope.rowData[i]['title'][0];
            var title_str = $scope.rowData[i]['title'][0];
            if (title_str.length > 35) {
              $scope.rowData[i]['short_title'] = title_str.substring(0,35) + "...";
            }
          }


          // free shipping
          for (var i = 0; i < $scope.rowData.length; i++) {
            $scope.rowData[i]['shipCost'] = $scope.rowData[i].shippingInfo[0]['shippingServiceCost'][0]['__value__'];
            var ship_cost = parseFloat($scope.rowData[i]['shipCost']);
            if (ship_cost == 0.0) {
              $scope.rowData[i]['shipCost'] = "Free Shipping";
            } else {
              $scope.rowData[i]['shipCost'] = "$" + $scope.rowData[i]['shipCost'];
            }
          }


          for (var i = 0; i < $scope.rowData.length; i++) {
            if ($scope.rowData[i]['ifSaved'] !== true) {
              $scope.rowData[i]['wishIconClass'] = "material-icons md-18";
              $scope.rowData[i]['shopping_cart'] = "add_shopping_cart";
            }
          }
          for (var k = 0; k < $scope.userStorage.length; k++) {
            storageKey = $scope.userStorage.key(k);
            for (var i = 0; i < $scope.rowData.length; i++) {
              if ($scope.rowData[i]['itemId'][0] === storageKey) {
                $scope.rowData[i]['wishIconClass'] = "material-icons md-18 yellow";
                $scope.rowData[i]['shopping_cart'] = "remove_shopping_cart";
              }
            }
          }
          console.log($scope.rowData);

          $scope.rowData1 = $scope.rowData;

        }
      }

    }

    $scope.getNextPageData = function() {
      if ($rootScope.currentPage === 1) {
        if (typeof $scope.rowData2 === 'undefined') {
          if ($rootScope.jsonData[0].hasOwnProperty('next_page_token')) {
            console.log("jsonData[0]: ")
            console.log($rootScope.jsonData[0]);
            $rootScope.currentPage++;
            $scope.showPrevious = true;
            $scope.nextPageToken1 = $rootScope.jsonData[0].next_page_token;
            var dataToPass = {
              nextPageToken: $scope.nextPageToken1
            }

            $http({
              method: 'GET',
              url: "http://localhost:8081/?",
              // url: 'http://hw8-result.us-east-2.elasticbeanstalk.com/',
              params: dataToPass
            })
            .then (function (response)
            {
              $rootScope.jsonData[1] = response.data;
              if ($rootScope.jsonData[1].hasOwnProperty('next_page_token'))
              {
                $scope.showNext = true;
              }
              else
              {
                $scope.showNext = false;
              }
              console.log("jsonData[1]: ")
              console.log($rootScope.jsonData[1]);
              $scope.rowData = $rootScope.jsonData[1]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
              for (var i = 0; i < $scope.rowData.length; i++)
              {
                if ($scope.rowData[i]['ifSaved'] !== true)
                {
                  $scope.rowData[i]['wishIconClass'] = "material-icons md-18";
                  $scope.rowData[i]['shopping_cart'] = "add_shopping_cart";
                }
              }
              for (var k = 0; k < $scope.userStorage.length; k++)
              {
                storageKey = $scope.userStorage.key(k);
                for (var i = 0; i < $scope.rowData.length; i++)
                {
                  if ($scope.rowData[i]['itemId'][0] === storageKey)
                  {
                    $scope.rowData[i]['wishIconClass'] = "material-icons md-18 yellow";
                    $scope.rowData[i]['shopping_cart'] = "remove_shopping_cart";
                  }
                }
              }
              $scope.rowData2 = $scope.rowData;
              console.log($scope.rowData2);
            },
            function(response)
            {
              console.error("Request error!");
            });
          }
          else
          {
            $scope.showNext = false;
          }
        }
        else
        {
          $rootScope.currentPage++;
          if ($rootScope.jsonData[1].hasOwnProperty('next_page_token'))
          {
            $scope.showNext = true;
          }
          else
          {
            $scope.showNext = false;
          }
          $scope.showPrevious = true;
          $scope.rowData = $scope.rowData2;
        }
      }

      else if ($rootScope.currentPage === 2)
      {
        if (typeof $scope.rowData3 === 'undefined')
        {
          if ($rootScope.jsonData[1].hasOwnProperty('next_page_token'))
          {
            $rootScope.currentPage++;
            $scope.showNext = false;
            $scope.showPrevious = true;
            $scope.nextPageToken2 = $rootScope.jsonData[1].next_page_token;
            var dataToPass = {
              nextPageToken: $scope.nextPageToken2
            }

            $http({
              method: 'GET',
              url: "http://localhost:8081/?",
              // url: 'http://hw8-result.us-east-2.elasticbeanstalk.com/',
              params: dataToPass
            })
            .then (function (response)
            {
              $rootScope.jsonData[2] = response.data;
              console.log("jsonData[2]: ")
              console.log($rootScope.jsonData[2]);
              $scope.rowData = $rootScope.jsonData[2]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
              for (var i = 0; i < $scope.rowData.length; i++)
              {
                if ($scope.rowData[i]['ifSaved'] !== true)
                {
                  $scope.rowData[i]['wishIconClass'] = "material-icons md-18";
                  $scope.rowData[i]['shopping_cart'] = "add_shopping_cart";
                }
              }
              for (var k = 0; k < $scope.userStorage.length; k++)
              {
                storageKey = $scope.userStorage.key(k);
                for (var i = 0; i < $scope.rowData.length; i++)
                {
                  if ($scope.rowData[i]['itemId'][0] === storageKey)
                  {
                    $scope.rowData[i]['wishIconClass'] = "material-icons md-18 yellow";
                    $scope.rowData[i]['shopping_cart'] = "remove_shopping_cart";
                  }
                }
              }
              $scope.rowData3 = $scope.rowData;
            },
            function(response)
            {
              console.error("Request error!");
            });
          }
          else
          {
            $scope.showNext = false;
          }
        }
        else
        {
          $rootScope.currentPage++;
          $scope.showNext = false;
          $scope.showPrevious = true;
          $scope.rowData = $scope.rowData3;
        }
      }

      else
      {
        $scope.showNext = false;
        $scope.showPrevious = true;
      }
    };

    $scope.getPreviousPage = function()
    {
      if ($rootScope.currentPage === 2)
      {
        $rootScope.currentPage--;
        $scope.showNext = true;
        $scope.showPrevious = false;
        $scope.rowData = $scope.rowData1;
      }
      else if ($rootScope.currentPage === 3)
      {
        $rootScope.currentPage--;
        $scope.showNext = true;
        $scope.showPrevious = true;
        $scope.rowData = $scope.rowData2;

      }
      else
      {
        $scope.showNext = true;
        $scope.showPrevious = false;
      }
    };

    $scope.requestDetails = function(index) {
      $rootScope.b_slide = true;
      $rootScope.moveToRight = true;
      $rootScope.b_clickWishDetail = false;
      $rootScope.showProgressBar = true;
      console.log($rootScope.currentPage);
      $scope.myPlaceId = $scope.rowData[index]['itemId'][0];
      console.log($scope.myPlaceId);

      // ebay single item api -------------------------------
      var input_single_Data = {
        itemId_single: $scope.myPlaceId
      }
      console.log(input_single_Data);
      $http({
        method: 'GET',
        url: "http://localhost:8081/?",
        params: input_single_Data
      })
      .then (function (response)
      {
        console.log("single api response");
        $scope.passData = [];
        $scope.singleItemDetail = response.data.Item;
        console.log($scope.singleItemDetail);
        $scope.passData[0] = $scope.singleItemDetail;

        // pass keyword + itemId
        $scope.passData[1] = [];
        $scope.passData[1][0] = $scope.myKeywordData;
        $scope.passData[1][1] = $scope.myPlaceId;

        $rootScope.curRowData = $scope.rowData[index];
        $scope.passData[2] = $rootScope.currentPage;
        $scope.passData[3] = $rootScope.jsonData;



        console.log($rootScope.curRowData);
        resultsDataService.setData($scope.passData);
        $rootScope.currentIndex = index;
        console.log($scope.passData);
        $rootScope.b_clickDetail = false;
        $rootScope.showProgressBar = false;
        $rootScope.savedKey = $scope.singleItemDetail.ItemID;
        console.log("before details_page (single api)");
        $location.path('/details_page');
        console.log("after details_page (single api)");
        for (var i = 0; i < $rootScope.jsonData.length; i++) {
          for (j = 0; j < $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'].length; j++) {
            if (typeof $rootScope.jsonData[i] !== 'undefined') {
              $rootScope.jsonData[i]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][j]['b_picked'] = false;
            }
          }
        }
        for (var i = 0; i < $rootScope.jsonData.length; i++) {
          for (j = 0; j < $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'].length; j++) {
            if ($rootScope.jsonData[i]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][j]['itemId'][0] === $rootScope.savedKey) {
              $rootScope.jsonData[i]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][j]['b_picked'] = true;
            }
          }
        }

      },
      function(response) 
      {
        console.error("single Response error!!!");
        $rootScope.showProgressBar = false;
        $scope.b_searchDone = false;
      });


    };

    $scope.redirect = function(myPath) {
      $location.path(myPath);
    };

    $scope.saveToLocalStorage = function(index) {
      console.log("local_storage");
      // ebay search api
      if ($scope.rowData[index]['wishIconClass'] === "material-icons md-18") {
        $scope.rowData[index]['wishIconClass'] = "material-icons md-18 yellow";
        $scope.rowData[index]['shopping_cart'] = "remove_shopping_cart";
        
        $scope.rowData[index]['ifSaved'] = true;
        // if ($rootScope.currentPage === 1)
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['ifSaved'] = true;
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['wishIconClass'] = "material-icons md-18 yellow";
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['shopping_cart'] = "remove_shopping_cart";
        


        // ebay single item api -------------------------------
        $scope.myPlaceId = $scope.rowData[index]['itemId'][0];
        var input_single_Data = {
          itemId_single: $scope.myPlaceId
        }
        console.log(input_single_Data);
        $http({
          method: 'GET',
          url: "http://localhost:8081/?",
          params: input_single_Data
        })
        .then (function (response) {
          console.log("single api response");
          $scope.jsonObj = response.data;
          console.log($scope.jsonObj);
          $rootScope.showProgressBar = false;
          $rootScope.b_slide = false;


          $scope.passData = [];
          $scope.singleItemDetail = response.data.Item;
          console.log($scope.singleItemDetail);
          $scope.passData[0] = $scope.singleItemDetail;

          // pass keyword + itemId
          $scope.myKeywordData = $scope.$parent.myKeyword;
          $scope.passData[1] = [];
          $scope.passData[1][0] = $scope.myKeywordData;
          $scope.passData[1][1] = $scope.myPlaceId;

          
          $scope.passData[2] = $scope.rowData[index]; // ebay search api for this itemId
          $scope.passData[3] = $scope.myLocationOption;


          if ($scope.myLocationOption === "option1") {
            $scope.passData[4] = "90007";
          }
          else {
            $scope.myInputLocation = $scope.$parent.myInputLocation;
            $scope.passData[4] = $scope.myInputLocation;
          }

          var timeStamp = Date.now();
          $scope.passData[5] = timeStamp;
          console.log($scope.passData);
          if(typeof(Storage) !== "undefined") {
            var key = $scope.myPlaceId;
            localStorage.setItem(key, JSON.stringify($scope.passData));
          } else {
            console.log("Sorry, your browser does not support web storage...");
          }


        },
        function(response)
        {
          console.error("saveToLocalStorage: single api Request error!");
          $rootScope.showProgressBar = false;
          $scope.b_searchDone = false;
        });


      } else {
        $scope.rowData[index]['wishIconClass'] = "material-icons md-18";
        $scope.rowData[index]['shopping_cart'] = "add_shopping_cart";

        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['ifSaved'] = false;
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['wishIconClass'] = "material-icons md-18";
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['shopping_cart'] = "add_shopping_cart";
       

        $scope.myPlaceId = $scope.rowData[index]['itemId'][0];
        $rootScope.detailWishIconClass = "material-icons md-18";
        $rootScope.shopping_cart = "add_shopping_cart";
        localStorage.removeItem($scope.myPlaceId);
      }


    };

    $scope.redirectDetailsPage = function() {
      $rootScope.b_slide = true;
      console.log("redirectDetailsPage");
      $location.path('/details_page');
    };

    $scope.changeAnimation = function() {

    }

  }]);
})(angular);
