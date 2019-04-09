
(function(angular) {
  var searchApp = angular.module('productSearchModel', [ 
    'angular-svg-round-progressbar',
    'ngRoute',
    'productSearchModel.productModule',
    'productSearchModel.detailsModule',
    'productSearchModel.wishModule',
    'productSearchModel.wishDetailsModule',
    'ngMaterial','ngMessages'
  ]);

  searchApp.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]);

  searchApp.controller('searchController', ['$scope', '$http', '$log', '$location', '$rootScope', '$q',  function($scope, $http, $log, $location, $rootScope, $q) {
 
    console.log($scope);

    $scope.isAutocompleteDisabled = true;
    $scope.noCache = true;
    $scope.querySearch = function(query) {
      $scope.myInputLocation = query;
      console.log('Text changed to :' + query);
      if (query === "" || typeof query === "undefined") {
        return [];
      }

      return $http.get("http://localhost:8081/?postalcode_startsWith=" + query) 
      .then(function(response) {
            console.log("autocomplete api response");
            $scope.autocompleteObj = response.data.postalCodes;  // 5 zipcodes
            // console.log($scope.autocompleteObj);
            $scope.recommend_zipcode = [];
            for (var i = 0; i < $scope.autocompleteObj.length; i++) {
              // console.log($scope.autocompleteObj[i].postalCode);
              $scope.recommend_zipcode[i] = $scope.autocompleteObj[i].postalCode;
            }       
            console.log($scope.recommend_zipcode);     
            return $scope.recommend_zipcode;
      },
      function(response)
      {
        console.error("autocomplete API error!");
        return [];
      });
    }

    $scope.selectedItemChange = selectedItemChange;

    function selectedItemChange(item) {
      console.log('Item changed to :' + JSON.stringify(item));
      $scope.myInputLocation = item;
    }


    $rootScope.b_slide = false;
    $rootScope.b_animation = false;
    $rootScope.b_clickWishDetail = false;
    $scope.myCategory = "default";
    $scope.b_clickSearch = false;
    $scope.b_clickResults = true;
    $rootScope.tempFavoriteRow = [];

    $scope.b_searchDone = true;
    $rootScope.b_clickDetail = true;
    $rootScope.b_clickWishDetail = true;
    if ($location.path() === '/wish_page') {
      $scope.b_clickResults = false;
      $scope.b_clickWish = true;
    }


    $scope.validateZipcode = function() {
      console.log($scope.myInputLocation);
      var valid = (/^\d{5}$/).test($scope.myInputLocation);
      if (valid) {
        console.log(true);
        return true;
      } else {
        console.log(false);
        return false;
      }
    };


    $scope.validateLocation = function() {
      if ($scope.myLocation === 2) {
        console.log("current is location 1");
        $scope.myInputLocation = "";
        $scope.isAutocompleteDisabled = true;
        $scope.selectedItem = null;
        $scope.searchText = "";
        $scope.myForm.inpute_location_autocomplete.$setPristine();
        $scope.myForm.inpute_location_autocomplete.$setUntouched();
        // console.log($scope);
      } else if ($scope.myLocation === 1) {
        console.log("current is location 2");
        $scope.isAutocompleteDisabled = false;
        // console.log($scope);
      }
    };

    $scope.b_disableKeywordLocation = function() {
      if ($scope.myLocation === 1) {
        // console.log("current is location 1");
        if ($scope.myForm.keyword.$invalid) {
          return true;
        }
      } else if ($scope.myLocation === 2) {
        // console.log("current is location 2");
        if ($scope.myForm.keyword.$invalid) {
          // console.log("keyword invalid");
          return true;
        }
        if ($scope.myForm.inpute_location_autocomplete.$invalid) {
          // console.log("inpute_location_autocomplete invalid");
          return true;
        }
        if (!$scope.validateZipcode()) {
          // console.log("zip code invalid");
          return true;
        }
      }
      return false;
    };

    $scope.clearInputs = function() {
      console.log("To location: " + "/");
      $location.path('/');

      $rootScope.b_slide = false;
      $rootScope.b_clickDetail = true;
      $rootScope.b_clickWishDetail = true;

      $scope.b_clickResults = true;
      $scope.b_clickWish = false;
      $scope.myForm.$setPristine();
      $scope.myForm.$setUntouched();
      $scope.myForm.$submitted = false;
      $scope.myKeyword = "";
      $scope.myDistance = "";
      $scope.myLocation = 1;
      $scope.myInputLocation = "";
      $scope.myCategory = "default";
      $scope.showTable = false;

      $scope.selectedItem = null;
      $scope.searchText = "";
    };

    $scope.getInputs = function(myPath) {
      console.log("To location: " + "/");
      $location.path('/');

      $rootScope.b_slide = false;
      $rootScope.showProgressBar = true;
      $rootScope.b_clickDetail = true;
      $rootScope.b_clickWishDetail = true;

      $scope.showTable = true;
      $scope.b_clickSearch = true;
      $scope.b_clickResults = true;
      $scope.b_clickWish = false;
      $scope.b_searchDone = true;

      if (typeof $scope.myDistance === 'undefined' || $scope.myDistance == "") {
        $scope.myDistance = 10;
      }

      if ($scope.myLocation === 1) {
        $scope.locationOption = "option1";
        $http({
          method: 'GET',
          url: 'http://ip-api.com/json'
        })
        .then (function (response)
        {
          $scope.currentZipcode = response.data.zip;

          var url_params = "http://localhost:8081/?"
          // var url_params = "http://hw8-nodejs.us-east-2.elasticbeanstalk.com/?"
          url_params += "category=" + $scope.myCategory + "&distance=" + $scope.myDistance +
          "&keyword=" + $scope.myKeyword + "&zipcode=" + $scope.currentZipcode;

          // 5 checkbox
          if (document.getElementById('input_new').checked) {
            url_params += "&new_condition=" + "true";
          } else {
            url_params += "&new_condition=" + "false";
          }
          if (document.getElementById('input_used').checked) {
            url_params += "&used=" + "true";
          } else {
            url_params += "&used=" + "false";
          }
          if (document.getElementById('input_unspecified').checked) {
            url_params += "&unspecified=" + "true";
          } else {
            url_params += "&unspecified=" + "false";
          }
          if (document.getElementById('input_pickup').checked) {
            url_params += "&local_pickup=" + "true";
          } else {
            url_params += "&local_pickup=" + "false";
          }
          if (document.getElementById('input_ship').checked) {
            url_params += "&free_shipping=" + "true";
          } else {
            url_params += "&free_shipping=" + "false";
          }     

          console.log(url_params);

          $http({
            method: 'GET',
            url: url_params,
          })
          .then (function (response)
          {
            $scope.jsonObj = response.data;
            //console.log($scope.jsonObj);
            $rootScope.showProgressBar = false;
            $rootScope.b_slide = false;
            console.log("To location: " + myPath);
            $location.path(myPath);
          },
          function(response)
          {
            console.error("Request error!");
            $rootScope.showProgressBar = false;
            $scope.b_searchDone = false;
          });
        },
        function(response)
        {
          console.error("Request error!");
        });
      } else if ($scope.myLocation === 2) {
        $scope.locationOption = "option2";
        

        var url_params = "http://localhost:8081/?"
        // var url_params = "http://hw8-nodejs.us-east-2.elasticbeanstalk.com/?"
        url_params += "category=" + $scope.myCategory + "&distance=" + $scope.myDistance +
        "&keyword=" + $scope.myKeyword + "&location=" + $scope.myInputLocation;

        // 5 checkbox
        if (document.getElementById('input_new').checked) {
          url_params += "&new_condition=" + "true";
        } else {
          url_params += "&new_condition=" + "false";
        }
        if (document.getElementById('input_used').checked) {
          url_params += "&used=" + "true";
        } else {
          url_params += "&used=" + "false";
        }
        if (document.getElementById('input_unspecified').checked) {
          url_params += "&unspecified=" + "true";
        } else {
          url_params += "&unspecified=" + "false";
        }
        if (document.getElementById('input_pickup').checked) {
          url_params += "&local_pickup=" + "true";
        } else {
          url_params += "&local_pickup=" + "false";
        }
        if (document.getElementById('input_ship').checked) {
          url_params += "&free_shipping=" + "true";
        } else {
          url_params += "&free_shipping=" + "false";
        }             

        console.log(url_params);

        $http({
          method: 'GET',
          url: url_params,
        })
        .then (function (response)
        {
          console.log("input location search response");
          $scope.jsonObj = response.data;
          //console.log($scope.jsonObj);
          $rootScope.showProgressBar = false;
          $scope.b_searchDone = true;
          $rootScope.b_animation = true;
          $rootScope.b_slide = false;
          console.log("To location: " + myPath);
          $location.path(myPath);
        },
        function(response)
        {
          console.error("Request error!");
          $rootScope.showProgressBar = false;
          $scope.b_searchDone = false;
        });
      }
    };

    $scope.clickSearchButton = function() {
      $rootScope.b_slide = false;
      if ($scope.b_clickSearch === true) {
        $scope.b_clickResults = true;
        $scope.b_clickWish = false;
        console.log("To location: " + "/product_page");
        $location.path('/product_page');
      } else {
        if ($scope.b_clickWish !== true) {
          alert("Please search something first.");
        } else {
          $scope.b_clickResults = false;
          $scope.b_clickWish = true;
          alert("Please search something first.");
        }
      }
    }

    $scope.clickWishButton = function() {
      $scope.b_clickWish = true;
      $scope.b_clickResults = false;
      $rootScope.b_slide = false;
      console.log("To location: " + "wish_page");
      $location.path('wish_page');
    }

    $scope.redirect = function(myPath) {
      console.log("To location: " + myPath);
      $location.path(myPath);
    };


    $scope.cleanAnimation = function() {
      $rootScope.b_slide = false;
    }

  }]);
})(angular);
