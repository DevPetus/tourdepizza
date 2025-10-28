// Cart Service - Manages shopping cart state
angular.module('tourDePizzaApp')
    .service('CartService', ['$rootScope', function($rootScope) {
        var cart = {
            items: [],
            customerId: null,
            orderId: null
        };

        this.addItem = function(pizza, quantity) {
            var existingItem = cart.items.find(function(item) {
                return item.pizza.id === pizza.id;
            });

            if (existingItem) {
                existingItem.quantity += quantity || 1;
            } else {
                cart.items.push({
                    pizza: pizza,
                    quantity: quantity || 1
                });
            }

            this.broadcastUpdate();
        };

        this.removeItem = function(pizzaId) {
            cart.items = cart.items.filter(function(item) {
                return item.pizza.id !== pizzaId;
            });
            this.broadcastUpdate();
        };

        this.updateQuantity = function(pizzaId, quantity) {
            var item = cart.items.find(function(item) {
                return item.pizza.id === pizzaId;
            });

            if (item) {
                if (quantity <= 0) {
                    this.removeItem(pizzaId);
                } else {
                    item.quantity = quantity;
                    this.broadcastUpdate();
                }
            }
        };

        this.getItems = function() {
            return cart.items;
        };

        this.getItemCount = function() {
            return cart.items.reduce(function(sum, item) {
                return sum + item.quantity;
            }, 0);
        };

        this.getTotal = function() {
            return cart.items.reduce(function(sum, item) {
                return sum + (item.pizza.calculatePrice() * item.quantity);
            }, 0);
        };

        this.clear = function() {
            cart.items = [];
            cart.orderId = null;
            this.broadcastUpdate();
        };

        this.setOrderId = function(orderId) {
            cart.orderId = orderId;
        };

        this.getOrderId = function() {
            return cart.orderId;
        };

        this.setCustomerId = function(customerId) {
            cart.customerId = customerId;
        };

        this.getCustomerId = function() {
            return cart.customerId;
        };

        this.broadcastUpdate = function() {
            $rootScope.$broadcast('cart:updated');
        };
    }]);
