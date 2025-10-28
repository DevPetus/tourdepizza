// Cart Controller
angular.module('tourDePizzaApp')
    .controller('CartController', ['CartService', '$location', '$scope', 
        function(CartService, $location, $scope) {
        var vm = this;
        vm.items = [];
        vm.itemCount = 0;
        vm.total = 0;

        vm.init = function() {
            vm.updateCart();
        };

        vm.updateCart = function() {
            vm.items = CartService.getItems();
            vm.itemCount = CartService.getItemCount();
            vm.total = CartService.getTotal();
        };

        vm.updateQuantity = function(pizzaId, quantity) {
            CartService.updateQuantity(pizzaId, parseInt(quantity));
            vm.updateCart();
        };

        vm.removeItem = function(pizzaId) {
            CartService.removeItem(pizzaId);
            vm.updateCart();
        };

        vm.checkout = function() {
            if (vm.items.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            $location.path('/checkout');
        };

        vm.continueShopping = function() {
            $location.path('/menu');
        };

        // Listen for cart updates
        $scope.$on('cart:updated', function() {
            vm.updateCart();
        });

        vm.init();
    }]);
