// Profile Controller
angular.module('tourDePizzaApp')
    .controller('ProfileController', ['CustomerService', '$location', 
        function(CustomerService, $location) {
        var vm = this;
        vm.customer = null;
        vm.allergies = [];
        vm.newAllergy = {
            name: '',
            severity: 'moderate',
            notes: ''
        };
        vm.error = '';
        vm.success = '';
        vm.isLoading = true;

        vm.init = function() {
            var customerId = CustomerService.getCurrentCustomerId();
            if (!customerId) {
                $location.path('/');
                return;
            }

            CustomerService.loadCurrentCustomer()
                .then(function(customer) {
                    vm.customer = customer;
                    vm.isLoading = false;
                    return CustomerService.getCustomerAllergies(customer.id);
                })
                .then(function(response) {
                    vm.allergies = response.data;
                })
                .catch(function(error) {
                    vm.error = 'Error loading profile';
                    vm.isLoading = false;
                });
        };

        vm.addAllergy = function() {
            if (!vm.newAllergy.name) {
                vm.error = 'Please enter allergy name';
                return;
            }

            vm.error = '';
            vm.success = '';

            CustomerService.addAllergy(vm.customer.id, vm.newAllergy)
                .then(function() {
                    vm.success = 'Allergy added successfully (securely stored)';
                    vm.allergies.push(angular.copy(vm.newAllergy));
                    vm.newAllergy = { name: '', severity: 'moderate', notes: '' };
                })
                .catch(function(error) {
                    vm.error = error.data ? error.data.error : 'Error adding allergy';
                });
        };

        vm.removeAllergy = function(allergyName) {
            if (!confirm('Remove allergy: ' + allergyName + '?')) {
                return;
            }

            CustomerService.removeAllergy(vm.customer.id, allergyName)
                .then(function() {
                    vm.success = 'Allergy removed successfully';
                    vm.allergies = vm.allergies.filter(function(a) {
                        return a.name !== allergyName;
                    });
                })
                .catch(function(error) {
                    vm.error = error.data ? error.data.error : 'Error removing allergy';
                });
        };

        vm.updateProfile = function() {
            vm.error = '';
            vm.success = '';

            CustomerService.updateCustomer(vm.customer.id, {
                name: vm.customer.name,
                email: vm.customer.email,
                phone: vm.customer.phone
            })
            .then(function(response) {
                vm.success = 'Profile updated successfully';
                CustomerService.setCurrentCustomer(response.data);
            })
            .catch(function(error) {
                vm.error = error.data ? error.data.error : 'Error updating profile';
            });
        };

        vm.init();
    }]);
