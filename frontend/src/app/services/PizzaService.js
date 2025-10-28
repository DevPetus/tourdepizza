// Pizza Service
angular.module('tourDePizzaApp')
    .service('PizzaService', ['ApiService', function(ApiService) {
        this.getAllPizzas = function() {
            return ApiService.get('/pizzas');
        };

        this.getPizzaById = function(id) {
            return ApiService.get('/pizzas/' + id);
        };

        this.createCustomPizza = function(pizza) {
            return ApiService.post('/pizzas', pizza);
        };

        this.getAllToppings = function() {
            return ApiService.get('/pizzas/toppings/available');
        };

        this.checkAllergens = function(pizzaId, allergens) {
            return ApiService.post('/pizzas/check-allergens', {
                pizzaId: pizzaId,
                allergens: allergens
            });
        };
    }]);
