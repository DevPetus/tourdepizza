// Home Controller
angular.module('tourDePizzaApp')
    .controller('HomeController', ['CustomerService', '$location', function(CustomerService, $location) {
        var vm = this;
        vm.customer = {
            name: '',
            email: '',
            phone: ''
        };
        vm.error = '';
        vm.isLoading = false;

        // Check if customer already exists
        vm.init = function() {
            var customerId = CustomerService.getCurrentCustomerId();
            if (customerId) {
                CustomerService.loadCurrentCustomer()
                    .then(function(customer) {
                        vm.customer = customer;
                    })
                    .catch(function() {
                        // Customer not found, show form
                    });
            }
        };

        vm.startOrder = function() {
            if (!vm.customer.name || !vm.customer.email || !vm.customer.phone) {
                vm.error = 'Please fill in all fields';
                return;
            }

            vm.isLoading = true;
            vm.error = '';

            var customerId = CustomerService.getCurrentCustomerId();
            if (customerId) {
                // Existing customer, go to menu
                $location.path('/menu');
            } else {
                // New customer, create account
                CustomerService.createCustomer(vm.customer)
                    .then(function(response) {
                        CustomerService.setCurrentCustomer(response.data);
                        $location.path('/menu');
                    })
                    .catch(function(error) {
                        vm.error = error.data ? error.data.error : 'Error creating account';
                        vm.isLoading = false;
                    });
            }
        };

        vm.init();
    }]);
