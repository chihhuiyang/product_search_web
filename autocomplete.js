(function() {
    angular.module('mdAutoCompleteDemo', ['ngMaterial', 'ngMessages'])
    .controller('DemoCtrl', DemoCtrl)
    .config(config);
    
    function DemoCtrl($timeout, $q) {
      var vm = this;
      // list of `state` value/display objects
      vm.states        = loadAll();
      vm.selectedItem  = null;
      vm.searchText    = null;
      vm.querySearch   = querySearch;
      // ******************************
      // Internal methods
      // ******************************
      /**
       * Search for states... use $timeout to simulate
       * remote dataservice call.
       */
      function querySearch (query) {
        var results = query ? vm.states.filter( createFilterFor(query) ) : [];
        return results;
      }
      /**
       * Build `states` list of key/value pairs
       */
      function loadAll() {
        var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
                A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20,\
                Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
                Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
                Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
                North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
                South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
                Wisconsin, Wyoming';
        return allStates.split(/, +/g).map( function (state) {
          return {
            value: state.toLowerCase(),
            display: state
          };
        });
      }
      /**
       * Create filter function for a query string
       */
      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
          return (state.value.indexOf(lowercaseQuery) === 0);
        };
      }
    }
    
    config.$inject = ['$provide'];
    
    function config($provide) {
      // add additional function to md-autocomplete
      $provide.decorator('mdAutocompleteDirective', mdAutoCompleteDirectiveOverride);
  
      mdAutoCompleteDirectiveOverride.$inject = ['$delegate'];
  
      function mdAutoCompleteDirectiveOverride($delegate) {
        var directive = $delegate[0];
        // need to append to base compile function
        var compile = directive.compile;
  
        // add our custom attribute to the directive's scope
        angular.extend(directive.scope, {
          menuContainerClass: '@?mdMenuContainerClass'
        });
  
        // recompile directive and add our class to the virtual repeat container
        directive.compile = function(element, attr) {
          var template = compile.apply(this, arguments);
          var menuContainerClass = attr.mdMenuContainerClass ? attr.mdMenuContainerClass : '';
          var menuContainer = element.find('md-virtual-repeat-container');
  
          menuContainer.addClass(menuContainerClass);
  
          // recompile the template
          return function(e, a) {
            template.apply(this, arguments);
          };
        };
  
        return $delegate;
      }
    }
  })();