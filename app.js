(function () {
'use strict';

angular.module('NarrowItDownApp', [])


.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', " https://davids-restaurant.herokuapp.com/menu_items.json")
.directive('foundItems', FoundItemsDirective);
    
function FoundItemsDirective() {
  var ddo = {
   templateUrl: 'menuList.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'menu',
    bindToController: true
  };

  return ddo;
}
    


function FoundItemsDirectiveController() {
  var menu = this;

}

NarrowItDownController.$inject = ['MenuSearchService','$scope'];
function NarrowItDownController(MenuSearchService, $scope) {
    var menu = this;
    menu.found = [];
    menu.getMenuItems = function (searchTerm) {
        $scope.errorMessage = false;
        menu.found = [];
        if (searchTerm) {
            
                
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    promise.then(function (response) {
        if (response.length !== 0) {
            menu.found = response;
        }
        else {
            $scope.errorMessage = "Nothing found";
            
        }
        })
        } else {
            $scope.errorMessage = "Nothing found"; 
        }
    
  };
    

    menu.removeItem = function (itemIndex) {
            menu.found.splice(itemIndex, 1);
        };


}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var items = [];


service.getMatchedMenuItems = function (searchTerm) {
    return $http({
        method: "GET",
        url: (ApiBasePath)
        }).then(function (result) {
        // process result and only keep items that match
        var fs = [];
        for (var i = 0; i < result.data.menu_items.length; i++) {
          var descr = result.data.menu_items[i].description;
          if ((descr.toLowerCase()).indexOf(searchTerm.toLowerCase()) !== -1) {
            fs.push(result.data.menu_items[i]);
          }
        }

    // return processed items
    return fs;
});
    

    };
    

}

})();