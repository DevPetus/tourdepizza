// Customer Service
angular.module('tourDePizzaApp')
    .service('CustomerService', ['ApiService', function(ApiService) {
        var currentCustomer = null;

        this.createCustomer = function(customer) {
            return ApiService.post('/customers', customer);
        };

        this.getCustomerById = function(id) {
            return ApiService.get('/customers/' + id);
        };

        this.updateCustomer = function(id, updates) {
            return ApiService.put('/customers/' + id, updates);
        };

        this.addAllergy = function(customerId, allergy) {
            return ApiService.post('/customers/allergies/add', {
                customerId: customerId,
                allergy: allergy
            });
        };

        this.removeAllergy = function(customerId, allergyName) {
            return ApiService.post('/customers/allergies/remove', {
                customerId: customerId,
                allergyName: allergyName
            });
        };

        this.getCustomerAllergies = function(customerId) {
            return ApiService.get('/customers/' + customerId + '/allergies');
        };

        this.setCurrentCustomer = function(customer) {
            currentCustomer = customer;
            localStorage.setItem('customerId', customer.id);
        };

        this.getCurrentCustomer = function() {
            return currentCustomer;
        };

        this.getCurrentCustomerId = function() {
            if (currentCustomer) {
                return currentCustomer.id;
            }
            return localStorage.getItem('customerId');
        };

        this.loadCurrentCustomer = function() {
            var customerId = this.getCurrentCustomerId();
            if (customerId) {
                var self = this;
                return this.getCustomerById(customerId).then(function(response) {
                    self.setCurrentCustomer(response.data);
                    return response.data;
                });
            }
            return Promise.reject('No customer ID found');
        };
    }]);
