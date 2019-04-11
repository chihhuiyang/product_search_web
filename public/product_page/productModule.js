
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
    $rootScope.b_flip = false;
    $rootScope.b_rightMotion = true;
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
      
      $scope.fiftyData = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];

          
      // count total pages & show pages
      $scope.totalPruductPage = 1;
      $scope.showPage1 = true;
      $scope.showPage2 = false;
      $scope.showPage3 = false;
      $scope.showPage4 = false;
      $scope.showPage5 = false;

      if ($scope.fiftyData.length >= 10) {
        $scope.totalPruductPage = 2;
        $scope.showPage2 = true;
      }
      if ($scope.fiftyData.length >= 20) {
        $scope.totalPruductPage = 3;
        $scope.showPage3 = true;
      }
      if ($scope.fiftyData.length >= 30) {
        $scope.totalPruductPage = 4;
        $scope.showPage4 = true;
      }
      if ($scope.fiftyData.length >= 40) {
        $scope.totalPruductPage = 5;
        $scope.showPage5 = true;
      }

      // disable previous or next
      if ($rootScope.curPruductPage === 1) {
        $scope.b_disablePrevious = true;
      } else if ($rootScope.curPruductPage === $scope.totalPruductPage) {
        $scope.b_disableNext = true;
      }

      // return to product page 
      $scope.b_activePage1 = false;
      $scope.b_activePage2 = false;
      $scope.b_activePage3 = false;
      $scope.b_activePage4 = false;
      $scope.b_activePage5 = false;
      if ($rootScope.curPruductPage == 1) {
        $scope.b_activePage1 = true;
      } else if ($rootScope.curPruductPage == 2) {
        $scope.b_activePage2 = true;
      } else if ($rootScope.curPruductPage == 3) {
        $scope.b_activePage3 = true;
      } else if ($rootScope.curPruductPage == 4) {
        $scope.b_activePage4 = true;
      } else if ($rootScope.curPruductPage == 5) {
        $scope.b_activePage5 = true;
      } 


      
      console.log($rootScope);
      console.log($scope);
      
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

          $scope.fiftyData = $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'];
        


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

          if ($scope.fiftyData.length >= 10) {
            $scope.totalPruductPage = 2;
            $scope.showPage2 = true;
          }
          if ($scope.fiftyData.length >= 20) {
            $scope.totalPruductPage = 3;
            $scope.showPage3 = true;
          }
          if ($scope.fiftyData.length >= 30) {
            $scope.totalPruductPage = 4;
            $scope.showPage4 = true;
          }
          if ($scope.fiftyData.length >= 40) {
            $scope.totalPruductPage = 5;
            $scope.showPage5 = true;
          }


          // page 1 display
          $scope.curPruductPage = 1;
          $rootScope.curPruductPage = 1;
          for (var i = 0; i < $scope.fiftyData.length; i++) {
            if (i < 10) {
              $scope.fiftyData[i]['showProductRow'] = true;
            } else {
              $scope.fiftyData[i]['showProductRow'] = false;
            }
          }

          
          // short title
          for (var i = 0; i < $scope.fiftyData.length; i++) {
            $scope.fiftyData[i]['short_title'] = $scope.fiftyData[i]['title'][0];
            var title_str = $scope.fiftyData[i]['title'][0];
            if (title_str.length > 35) {
              $scope.fiftyData[i]['short_title'] = title_str.substring(0,35) + "...";
            }
          }


          // free shipping
          for (var i = 0; i < $scope.fiftyData.length; i++) {
            $scope.fiftyData[i]['shipCost'] = $scope.fiftyData[i].shippingInfo[0]['shippingServiceCost'][0]['__value__'];
            var ship_cost = parseFloat($scope.fiftyData[i]['shipCost']);
            if (ship_cost == 0.0) {
              $scope.fiftyData[i]['shipCost'] = "Free Shipping";
            } else {
              $scope.fiftyData[i]['shipCost'] = "$" + $scope.fiftyData[i]['shipCost'];
            }
          }


          // Wish List icon
          for (var i = 0; i < $scope.fiftyData.length; i++) {
            if ($scope.fiftyData[i]['ifSaved'] !== true) {
              $scope.fiftyData[i]['wishIconClass'] = "material-icons md-18";
              $scope.fiftyData[i]['shopping_cart'] = "add_shopping_cart";
            }
          }
          for (var k = 0; k < $scope.userStorage.length; k++) {
            storageKey = $scope.userStorage.key(k);
            for (var i = 0; i < $scope.fiftyData.length; i++) {
              if ($scope.fiftyData[i]['itemId'][0] === storageKey) {
                $scope.fiftyData[i]['wishIconClass'] = "material-icons md-18 yellow";
                $scope.fiftyData[i]['shopping_cart'] = "remove_shopping_cart";
              }
            }
          }
          console.log($scope.fiftyData);

          $scope.fiftyData1 = $scope.fiftyData;

        }
      }

    }


    $scope.requestDetails = function(index) {
      $rootScope.b_flip = true;
      $rootScope.b_rightMotion = true;
      $rootScope.b_clickWishDetail = false;
      $rootScope.showProgressBar = true;
      console.log($rootScope.currentPage);
      $scope.curItemId = $scope.fiftyData[index]['itemId'][0];
      console.log($scope.curItemId);

      // ebay single item api -------------------------------
      var input_single_Data = {
        itemId_single: $scope.curItemId
      }
      console.log(input_single_Data);
      $http({
        method: 'GET',
        url: "http://localhost:8081/?",
        // url: "http://chihhuiy-nodejs.us-east-2.elasticbeanstalk.com/?",
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
        $scope.passData[1][1] = $scope.curItemId;

        $rootScope.curfiftyData = $scope.fiftyData[index];
        $scope.passData[2] = $rootScope.currentPage;
        $scope.passData[3] = $rootScope.jsonData;



        // console.log($rootScope.curfiftyData);
        resultsDataService.setData($scope.passData);
        $rootScope.currentIndex = index;
        console.log($scope.passData);
        $rootScope.b_clickDetail = false;
        $rootScope.showProgressBar = false;
        $rootScope.savedKey = $scope.singleItemDetail.ItemID;
        console.log("To location: " + "/details_page");
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
              console.log("picked index : " + j);
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

    $scope.redirect = function(path) {
      console.log("To location: " + path);
      $location.path(path);
    };

    $scope.saveToLocalStorage = function(index) {
      console.log("saveToLocalStorage");
      // ebay search api
      if ($scope.fiftyData[index]['wishIconClass'] === "material-icons md-18") {
        $scope.fiftyData[index]['ifSaved'] = true;
        $scope.fiftyData[index]['wishIconClass'] = "material-icons md-18 yellow";
        $scope.fiftyData[index]['shopping_cart'] = "remove_shopping_cart";
        
        // pass to root
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['ifSaved'] = true;
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['wishIconClass'] = "material-icons md-18 yellow";
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['shopping_cart'] = "remove_shopping_cart";
        
        // ebay single item api -------------------------------
        $scope.curItemId = $scope.fiftyData[index]['itemId'][0];
        var input_single_Data = {
          itemId_single: $scope.curItemId
        }
        console.log($scope.curItemId);
        $http({
          method: 'GET',
          url: "http://localhost:8081/?",
          // url: "http://chihhuiy-nodejs.us-east-2.elasticbeanstalk.com/?",
          params: input_single_Data
        })
        .then (function (response) {
          console.log("single api response");
          $scope.jsonObj = response.data;
          // console.log($scope.jsonObj);
          $rootScope.showProgressBar = false;
          $rootScope.b_flip = false;

          $scope.passData = [];
          $scope.singleItemDetail = response.data.Item;
          // console.log($scope.singleItemDetail);
          $scope.passData[0] = $scope.singleItemDetail;

          // pass keyword + itemId
          $scope.myKeywordData = $scope.$parent.myKeyword;
          $scope.passData[1] = [];
          $scope.passData[1][0] = $scope.myKeywordData;
          $scope.passData[1][1] = $scope.curItemId;         
          $scope.passData[2] = $scope.fiftyData[index]; // ebay search api for this itemId
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
            var key = $scope.curItemId;
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
        $scope.fiftyData[index]['wishIconClass'] = "material-icons md-18";
        $scope.fiftyData[index]['shopping_cart'] = "add_shopping_cart";

        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['ifSaved'] = false;
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['wishIconClass'] = "material-icons md-18";
        $rootScope.jsonData[0]['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][index]['shopping_cart'] = "add_shopping_cart";
       

        $scope.curItemId = $scope.fiftyData[index]['itemId'][0];
        $rootScope.detailWishIconClass = "material-icons md-18";
        $rootScope.shopping_cart = "add_shopping_cart";
        localStorage.removeItem($scope.curItemId);
      }


    };

    $scope.redirectDetailsPage = function() {
      $rootScope.b_flip = true;
      console.log("To location: " + "details_page");
      $location.path('/details_page');
    };

    $scope.changeAnimation = function() {

    };

    $scope.page1 = function() {
      console.log("page 1");
      // update page
      $scope.curPruductPage = 1;
      $rootScope.curPruductPage = 1;

      // active
      $scope.b_activePage1 = true;
      $scope.b_activePage2 = false;
      $scope.b_activePage3 = false;
      $scope.b_activePage4 = false;
      $scope.b_activePage5 = false;

      // disable & dispaly
      $scope.b_disablePrevious = true;
      $scope.b_disableNext = false;
      for (var i = 0; i < $scope.fiftyData.length; i++) {
        if (i < 10) {
          $scope.fiftyData[i]['showProductRow'] = true;
        } else {
          $scope.fiftyData[i]['showProductRow'] = false;
        }
      }
    };

    $scope.page2 = function() {
      console.log("page 2");
      // update page
      $scope.curPruductPage = 2;
      $rootScope.curPruductPage = 2;

      // active
      $scope.b_activePage1 = false;
      $scope.b_activePage2 = true;
      $scope.b_activePage3 = false;
      $scope.b_activePage4 = false;
      $scope.b_activePage5 = false;     

      // disable & dispaly
      $scope.b_disablePrevious = false;
      $scope.b_disableNext = false;
      for (var i = 0; i < $scope.fiftyData.length; i++) {
        if (i >= 10 && i < 20) {
          $scope.fiftyData[i]['showProductRow'] = true;
        } else {
          $scope.fiftyData[i]['showProductRow'] = false;
        }
      }
    };

    $scope.page3 = function() {
      console.log("page 3");

      // update page
      $scope.curPruductPage = 3; 
      $rootScope.curPruductPage = 3;     

      // active
      $scope.b_activePage1 = false;
      $scope.b_activePage2 = false;
      $scope.b_activePage3 = true;
      $scope.b_activePage4 = false;
      $scope.b_activePage5 = false;

      // disable & dispaly
      $scope.b_disablePrevious = false;
      $scope.b_disableNext = false;
      for (var i = 0; i < $scope.fiftyData.length; i++) {
        if (i >= 20 && i < 30) {
          $scope.fiftyData[i]['showProductRow'] = true;
        } else {
          $scope.fiftyData[i]['showProductRow'] = false;
        }
      }
    };

    $scope.page4 = function() {
      console.log("page 4");

      // update page
      $scope.curPruductPage = 4;      
      $rootScope.curPruductPage = 4;

      // active
      $scope.b_activePage1 = false;
      $scope.b_activePage2 = false;
      $scope.b_activePage3 = false;
      $scope.b_activePage4 = true;
      $scope.b_activePage5 = false;

      // disable & dispaly
      $scope.b_disablePrevious = false;
      $scope.b_disableNext = false;
      for (var i = 0; i < $scope.fiftyData.length; i++) {
        if (i >= 30 && i < 40) {
          $scope.fiftyData[i]['showProductRow'] = true;
        } else {
          $scope.fiftyData[i]['showProductRow'] = false;
        }
      }
    };

    $scope.page5 = function() {
      console.log("page 5");

      // update page
      $scope.curPruductPage = 5;
      $rootScope.curPruductPage = 5;

      // active
      $scope.b_activePage1 = false;
      $scope.b_activePage2 = false;
      $scope.b_activePage3 = false;
      $scope.b_activePage4 = false;
      $scope.b_activePage5 = true;

      // disable & dispaly
      $scope.b_disablePrevious = false;
      $scope.b_disableNext = true;

      for (var i = 0; i < $scope.fiftyData.length; i++) {
        if (i >= 40 && i < 50) {
          $scope.fiftyData[i]['showProductRow'] = true;
        } else {
          $scope.fiftyData[i]['showProductRow'] = false;
        }
      }
    };


    $scope.goPreviousPage = function() {
      if ($rootScope.curPruductPage === 2) {
        $scope.page1();
      } else if ($rootScope.curPruductPage === 3) {
        $scope.page2();
      } else if ($rootScope.curPruductPage === 4) {
        $scope.page3();
      } else if ($rootScope.curPruductPage === 5) {
        $scope.page4();
      }
    };


    $scope.goNextPage = function() {
      if ($rootScope.curPruductPage === 1) {
        $scope.page2();
      } else if ($rootScope.curPruductPage === 2) {
        $scope.page3();
      } else if ($rootScope.curPruductPage === 3) {
        $scope.page4();
      } else if ($rootScope.curPruductPage === 4) {
        $scope.page5();
      }  
    };


  }]);
})(angular);
