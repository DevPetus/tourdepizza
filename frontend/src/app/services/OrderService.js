// Order Service
angular.module('tourDePizzaApp')
    .service('OrderService', ['ApiService', function(ApiService) {
        this.createOrder = function(customerId) {
            return ApiService.post('/orders', { customerId: customerId });
        };

        this.getOrderById = function(orderId) {
            return ApiService.get('/orders/' + orderId);
        };

        this.getOrdersByCustomer = function(customerId) {
            return ApiService.get('/orders/customer/' + customerId);
        };

        this.addPizzaToOrder = function(orderId, pizzaId, quantity) {
            return ApiService.post('/orders/add-pizza', {
                orderId: orderId,
                pizzaId: pizzaId,
                quantity: quantity
            });
        };

        this.removePizzaFromOrder = function(orderId, pizzaId) {
            return ApiService.post('/orders/remove-pizza', {
                orderId: orderId,
                pizzaId: pizzaId
            });
        };

        this.updatePizzaQuantity = function(orderId, pizzaId, quantity) {
            return ApiService.post('/orders/update-quantity', {
                orderId: orderId,
                pizzaId: pizzaId,
                quantity: quantity
            });
        };

        this.setDeliveryAddress = function(orderId, address) {
            return ApiService.post('/orders/delivery-address', {
                orderId: orderId,
                address: address
            });
        };

        this.setPayment = function(orderId, payment) {
            return ApiService.post('/orders/payment', {
                orderId: orderId,
                payment: payment
            });
        };

        this.confirmOrder = function(orderId) {
            return ApiService.post('/orders/confirm', { orderId: orderId });
        };

        this.cancelOrder = function(orderId) {
            return ApiService.post('/orders/cancel', { orderId: orderId });
        };

        this.getOrderTotal = function(orderId) {
            return ApiService.get('/orders/' + orderId + '/total');
        };
    }]);
