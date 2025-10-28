// API Service - Handles HTTP requests
angular.module('tourDePizzaApp')
    .service('ApiService', ['$http', 'API_URL', function($http, API_URL) {
        this.get = function(endpoint) {
            return $http.get(API_URL + endpoint);
        };

        this.post = function(endpoint, data) {
            return $http.post(API_URL + endpoint, data);
        };

        this.put = function(endpoint, data) {
            return $http.put(API_URL + endpoint, data);
        };

        this.delete = function(endpoint) {
            return $http.delete(API_URL + endpoint);
        };
    }]);
