
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
      // after click some specific product
      $scope.ifHasTable = true;
      $rootScope.currentPage = resultsDataService.getData()[0];
      console.log($rootScope.currentPage);
      $rootScope.jsonData = resultsDataService.getData()[1];
      console.log($rootScope.jsonData);

        for (var j = 0; j < $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'].length; j++) {
          if (typeof $rootScope.jsonData[0] !== 'undefined') {
            $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][j]['b_picked'] = false;
          }
        }
      

        console.log($rootScope.savedKey);
        for (var j = 0; j < $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'].length; j++) {
          if ($rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][j]['itemId'][0] === $rootScope.savedKey) {
            console.log("Picked: " + $rootScope.savedKey);
            $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][j]['b_picked'] = true;
          }
        }
      
      $scope.rowData = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];

      
    } else {  // before click some specific product [initial]
      $rootScope.jsonData = [];
      $rootScope.jsonData[0] = $scope.$parent.jsonObj;
      $rootScope.currentPage = 1;
      console.log($rootScope.jsonData[0]);
      
      if ($rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'] == null) { // null searchResult
        // No Records have been found
        $scope.ifHasTable = false;
      } else {  // valid item
        var count_str = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['@count'];
        count_items = parseInt(count_str);
        if (count_items == 0) {
          // No Records have been found
          $scope.ifHasTable = false;
        } else {
          $scope.ifHasTable = true;

          $scope.rowData = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
        


          // initial page active
          $scope.b_activePage1 = true;
          $scope.b_activePage2 = false;
          $scope.b_activePage3 = false;
          $scope.b_activePage4 = false;
          $scope.b_activePage5 = false;


          $scope.b_disablePrevious = true;
          // count total pages & show pages
          $scope.totalPruductPage = 1;
          $scope.showPage1 = true;
          $scope.showPage2 = false;
          $scope.showPage3 = false;
          $scope.showPage4 = false;
          $scope.showPage5 = false;

          if ($scope.rowData.length >= 10) {
            $scope.totalPruductPage = 2;
            $scope.showPage2 = true;
          }
          if ($scope.rowData.length >= 20) {
            $scope.totalPruductPage = 3;
            $scope.showPage3 = true;
          }
          if ($scope.rowData.length >= 30) {
            $scope.totalPruductPage = 4;
            $scope.showPage4 = true;
          }
          if ($scope.rowData.length >= 40) {
            $scope.totalPruductPage = 5;
            $scope.showPage5 = true;
          }


          // page 1 display
          $scope.curPruductPage = 1;
          for (var i = 0; i < $scope.rowData.length; i++) {
            if (i < 10) {
              $scope.rowData[i]['showProductRow'] = true;
            } else {
              $scope.rowData[i]['showProductRow'] = false;
            }
          }

          
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


          // Wish List icon
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
        // console.log($scope.singleItemDetail);
        $scope.passData[0] = $scope.singleItemDetail;

        // pass keyword + itemId
        $scope.passData[1] = [];
        $scope.passData[1][0] = $scope.myKeywordData;
        $scope.passData[1][1] = $scope.myPlaceId;

        $rootScope.curRowData = $scope.rowData[index];
        $scope.passData[2] = $rootScope.currentPage;
        $scope.passData[3] = $rootScope.jsonData;



        // console.log($rootScope.curRowData);
        resultsDataService.setData($scope.passData);
        $rootScope.currentIndex = index;
        console.log($scope.passData);
        $rootScope.b_clickDetail = false;
        $rootScope.showProgressBar = false;
        $rootScope.savedKey = $scope.singleItemDetail.ItemID;
        $location.path('/details_page');
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
      console.log("saveToLocalStorage");
      // ebay search api
      if ($scope.rowData[index]['wishIconClass'] === "material-icons md-18") {
        $scope.rowData[index]['ifSaved'] = true;
        $scope.rowData[index]['wishIconClass'] = "material-icons md-18 yellow";
        $scope.rowData[index]['shopping_cart'] = "remove_shopping_cart";
        
        // pass to root
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['ifSaved'] = true;
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['wishIconClass'] = "material-icons md-18 yellow";
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['shopping_cart'] = "remove_shopping_cart";
        
        // ebay single item api -------------------------------
        $scope.myPlaceId = $scope.rowData[index]['itemId'][0];
        var input_single_Data = {
          itemId_single: $scope.myPlaceId
        }
        console.log($scope.myPlaceId);
        $http({
          method: 'GET',
          url: "http://localhost:8081/?",
          params: input_single_Data
        })
        .then (function (response) {
          console.log("single api response");
          $scope.jsonObj = response.data;
          // console.log($scope.jsonObj);
          $rootScope.showProgressBar = false;
          $rootScope.b_slide = false;


          $scope.passData = [];
          $scope.singleItemDetail = response.data.Item;
          // console.log($scope.singleItemDetail);
          $scope.passData[0] = $scope.singleItemDetail;

          // pass keyword + itemId
          $scope.myKeywordData = $scope.$parent.myKeyword;
          $scope.passData[1] = [];
          $scope.passData[1][0] = $scope.myKeywordData;
          $scope.passData[1][1] = $scope.myPlaceId;

          
          $scope.passData[2] = $scope.rowData[index]; // ebay search api for this itemId
          $scope.passData[3] = $scope.myLocationOption;


          if ($scope.myLocationOption === "option1") {
            $scope.passData[4] =  $scope.$parent.currentZipcode;
          } else {
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

    };

    $scope.page1 = function() {
      console.log("page 1");
      // update page
      $scope.curPruductPage = 1;

      // active
      $scope.b_activePage1 = true;
      $scope.b_activePage2 = false;
      $scope.b_activePage3 = false;
      $scope.b_activePage4 = false;
      $scope.b_activePage5 = false;

      // disable & dispaly
      $scope.b_disablePrevious = true;
      for (var i = 0; i < $scope.rowData.length; i++) {
        if (i < 10) {
          $scope.rowData[i]['showProductRow'] = true;
        } else {
          $scope.rowData[i]['showProductRow'] = false;
        }
      }
    };

    $scope.page2 = function() {
      console.log("page 2");
      // update page
      $scope.curPruductPage = 2;

      // active
      $scope.b_activePage1 = false;
      $scope.b_activePage2 = true;
      $scope.b_activePage3 = false;
      $scope.b_activePage4 = false;
      $scope.b_activePage5 = false;     

      // disable & dispaly
      $scope.b_disablePrevious = false;
      $scope.b_disableNext = false;
      for (var i = 0; i < $scope.rowData.length; i++) {
        if (i >= 10 && i < 20) {
          $scope.rowData[i]['showProductRow'] = true;
        } else {
          $scope.rowData[i]['showProductRow'] = false;
        }
      }
    };

    $scope.page3 = function() {
      console.log("page 3");

      // update page
      $scope.curPruductPage = 3;      

      // active
      $scope.b_activePage1 = false;
      $scope.b_activePage2 = false;
      $scope.b_activePage3 = true;
      $scope.b_activePage4 = false;
      $scope.b_activePage5 = false;

      // disable & dispaly
      $scope.b_disablePrevious = false;
      $scope.b_disableNext = false;
      for (var i = 0; i < $scope.rowData.length; i++) {
        if (i >= 20 && i < 30) {
          $scope.rowData[i]['showProductRow'] = true;
        } else {
          $scope.rowData[i]['showProductRow'] = false;
        }
      }
    };

    $scope.page4 = function() {
      console.log("page 4");

      // update page
      $scope.curPruductPage = 4;      

      // active
      $scope.b_activePage1 = false;
      $scope.b_activePage2 = false;
      $scope.b_activePage3 = false;
      $scope.b_activePage4 = true;
      $scope.b_activePage5 = false;

      // disable & dispaly
      $scope.b_disablePrevious = false;
      $scope.b_disableNext = false;
      for (var i = 0; i < $scope.rowData.length; i++) {
        if (i >= 30 && i < 40) {
          $scope.rowData[i]['showProductRow'] = true;
        } else {
          $scope.rowData[i]['showProductRow'] = false;
        }
      }
    };

    $scope.page5 = function() {
      console.log("page 5");

      // update page
      $scope.curPruductPage = 5;

      // active
      $scope.b_activePage1 = false;
      $scope.b_activePage2 = false;
      $scope.b_activePage3 = false;
      $scope.b_activePage4 = false;
      $scope.b_activePage5 = true;

      // disable & dispaly
      $scope.b_disableNext = true;
      for (var i = 0; i < $scope.rowData.length; i++) {
        if (i >= 40 && i < 50) {
          $scope.rowData[i]['showProductRow'] = true;
        } else {
          $scope.rowData[i]['showProductRow'] = false;
        }
      }
    };


    $scope.goPreviousPage = function() {
      if ($scope.curPruductPage === 2) {
        $scope.page1();
      } else if ($scope.curPruductPage === 3) {
        $scope.page2();
      } else if ($scope.curPruductPage === 4) {
        $scope.page3();
      } else if ($scope.curPruductPage === 5) {
        $scope.page4();
      }
    };


    $scope.goNextPage = function() {
      if ($scope.curPruductPage === 1) {
        $scope.page2();
      } else if ($scope.curPruductPage === 2) {
        $scope.page3();
      } else if ($scope.curPruductPage === 3) {
        $scope.page4();
      } else if ($scope.curPruductPage === 4) {
        $scope.page5();
      }  
    };


  }]);
})(angular);
