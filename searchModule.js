
(function(angular) {
  var searchApp = angular.module('productSearchModel', [ 
    'angular-svg-round-progressbar',
    'ngRoute',
    'productSearchModel.productModule',
    'productSearchModel.detailsModule',
    'productSearchModel.wishModule',
    'productSearchModel.wishDetailsModule'
  ]);

  searchApp.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }]);

  searchApp.controller('searchController', ['$scope', '$http', '$log', '$location', '$rootScope', function($scope, $http, $log, $location, $rootScope) {
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

    $scope.validateLocation = function() {
      if (document.getElementById('location_option1').checked) {
        document.getElementById('input_location').disabled = true;
        $scope.myInputLocation = "";
      }
      if (document.getElementById('location_option2').checked) {
        document.getElementById('input_location').disabled = false;
      }
    };

    $scope.b_disableKeywordLocation = function() {
      if ($scope.myLocation === 1) {
        $scope.myForm.inputLocation.$setPristine();
        $scope.myForm.inputLocation.$setUntouched();
        if ($scope.myForm.keyword.$invalid) {
          return true;
        }
      } else if ($scope.myLocation === 2) {
        if ($scope.myForm.keyword.$invalid || $scope.myForm.inputLocation.$invalid) {
          return true;
        }
      }
    };

    $scope.clearInputs = function() {
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
      document.getElementById('input_location').disabled = true;
    };

    $scope.getInputs = function(myPath) {
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
        
        // autocomplete 
        if (typeof $scope.autocompleteObj !== 'undefined') {
          console.log($scope.autocompleteObj);
        }
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
      $location.path('wish_page');
    }

    $scope.redirect = function(myPath) {
      $location.path(myPath);
    };

    $scope.autoComplete = function() {
      var input = document.getElementById('input_location');

      // autocomplete api -------------------------------
      var input_Data = {
        postalcode_startsWith: input
      }
      console.log(input_Data);
      $http({
        method: 'GET',
        url: "http://localhost:8081/?",
        params: input_Data
      })
      .then (function (response)
      {
        console.log("autocomplete api response");
        $scope.autocompleteObj = response.data.postalCodes[0];  // 5 zipcodes
        console.log($scope.autocompleteObj);


      },
      function(response)
      {
        console.error("autocomplete request error!!!");
      });


    };

    $scope.cleanAnimation = function() {
      $rootScope.b_slide = false;
    }

  }]);
})(angular);
