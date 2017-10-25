
angular.module('myApp', [
  'ngRoute',
  'toastr'
]).

config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/home/:id', {
	    templateUrl: 'views/home.html',
	    controller: 'HomeCtrl' 
	  })
    //here is our failsafe -- if a user requests a route we don't have
    //set up, we will just direct them back to home
  	.otherwise({redirectTo: '/home/search'});
}]);
