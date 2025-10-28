// AngularJS Application Module
angular.module('tourDePizzaApp', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/app/components/home/home.html',
                controller: 'HomeController',
                controllerAs: 'home'
            })
            .when('/menu', {
                templateUrl: 'src/app/components/menu/menu.html',
                controller: 'MenuController',
                controllerAs: 'menu'
            })
            .when('/cart', {
                templateUrl: 'src/app/components/cart/cart.html',
                controller: 'CartController',
                controllerAs: 'cart'
            })
            .when('/checkout', {
                templateUrl: 'src/app/components/checkout/checkout.html',
                controller: 'CheckoutController',
                controllerAs: 'checkout'
            })
            .when('/profile', {
                templateUrl: 'src/app/components/profile/profile.html',
                controller: 'ProfileController',
                controllerAs: 'profile'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .constant('API_URL', 'http://localhost:3000/api');
