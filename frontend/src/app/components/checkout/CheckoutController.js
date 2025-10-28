// Checkout Controller
angular.module('tourDePizzaApp')
    .controller('CheckoutController', ['CartService', 'OrderService', 'CustomerService', '$location', 
        function(CartService, OrderService, CustomerService, $location) {
        var vm = this;
        vm.step = 1; // 1: Address, 2: Payment, 3: Confirm
        vm.items = [];
        vm.total = 0;
        vm.orderId = null;
        vm.error = '';
        vm.isLoading = false;

        vm.address = {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
            instructions: ''
        };

        vm.payment = {
            method: 'credit_card',
            cardNumber: '',
            cardHolder: '',
            expirationDate: '',
            cvv: ''
        };

        vm.init = function() {
            vm.items = CartService.getItems();
            vm.total = CartService.getTotal();

            if (vm.items.length === 0) {
                $location.path('/cart');
                return;
            }

            // Create order
            var customerId = CustomerService.getCurrentCustomerId();
            if (!customerId) {
                $location.path('/');
                return;
            }

            // Check if we already have an order
            vm.orderId = CartService.getOrderId();
            if (!vm.orderId) {
                OrderService.createOrder(customerId).then(function(response) {
                    vm.orderId = response.data.id;
                    CartService.setOrderId(vm.orderId);
                    
                    // Add items to order
                    vm.items.forEach(function(item) {
                        OrderService.addPizzaToOrder(vm.orderId, item.pizza.id, item.quantity);
                    });
                });
            }
        };

        vm.nextStep = function() {
            if (vm.step === 1) {
                vm.submitAddress();
            } else if (vm.step === 2) {
                vm.submitPayment();
            }
        };

        vm.previousStep = function() {
            vm.step--;
        };

        vm.submitAddress = function() {
            if (!vm.address.street || !vm.address.city || !vm.address.state || !vm.address.zipCode) {
                vm.error = 'Please fill in all address fields';
                return;
            }

            vm.isLoading = true;
            vm.error = '';

            OrderService.setDeliveryAddress(vm.orderId, vm.address)
                .then(function() {
                    vm.step = 2;
                    vm.isLoading = false;
                })
                .catch(function(error) {
                    vm.error = error.data ? error.data.error : 'Error saving address';
                    vm.isLoading = false;
                });
        };

        vm.submitPayment = function() {
            if (!vm.payment.cardNumber || !vm.payment.cardHolder || !vm.payment.expirationDate || !vm.payment.cvv) {
                vm.error = 'Please fill in all payment fields';
                return;
            }

            vm.isLoading = true;
            vm.error = '';

            OrderService.setPayment(vm.orderId, vm.payment)
                .then(function() {
                    vm.step = 3;
                    vm.isLoading = false;
                })
                .catch(function(error) {
                    vm.error = error.data ? error.data.error : 'Error saving payment';
                    vm.isLoading = false;
                });
        };

        vm.confirmOrder = function() {
            vm.isLoading = true;
            vm.error = '';

            OrderService.confirmOrder(vm.orderId)
                .then(function() {
                    alert('Order confirmed! Your pizza will be delivered soon.');
                    CartService.clear();
                    $location.path('/');
                })
                .catch(function(error) {
                    vm.error = error.data ? error.data.error : 'Error confirming order';
                    vm.isLoading = false;
                });
        };

        vm.init();
    }]);
