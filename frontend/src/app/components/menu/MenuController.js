// Menu Controller
angular.module('tourDePizzaApp')
    .controller('MenuController', ['PizzaService', 'CartService', 'CustomerService', '$location', 
        function(PizzaService, CartService, CustomerService, $location) {
        var vm = this;
        vm.pizzas = [];
        vm.toppings = [];
        vm.selectedPizza = null;
        vm.customPizza = {
            name: '',
            size: 'medium',
            basePrice: 8.99,
            toppingIds: []
        };
        vm.error = '';
        vm.success = '';
        vm.isLoading = true;
        vm.customerAllergies = [];

        vm.init = function() {
            // Load pizzas and toppings
            PizzaService.getAllPizzas().then(function(response) {
                vm.pizzas = response.data;
                vm.isLoading = false;
            }).catch(function(error) {
                vm.error = 'Error loading pizzas';
                vm.isLoading = false;
            });

            PizzaService.getAllToppings().then(function(response) {
                vm.toppings = response.data;
            });

            // Load customer allergies
            var customerId = CustomerService.getCurrentCustomerId();
            if (customerId) {
                CustomerService.getCustomerAllergies(customerId).then(function(response) {
                    vm.customerAllergies = response.data.map(function(a) { return a.name; });
                });
            }
        };

        vm.calculatePizzaPrice = function(pizza) {
            var sizeMultiplier = { small: 1.0, medium: 1.3, large: 1.6 };
            var toppingsPrice = pizza.toppings ? 
                pizza.toppings.reduce(function(sum, t) { return sum + t.price; }, 0) : 0;
            return ((pizza.basePrice + toppingsPrice) * (sizeMultiplier[pizza.size] || 1.0)).toFixed(2);
        };

        vm.addToCart = function(pizza) {
            // Check for allergens
            if (vm.customerAllergies.length > 0) {
                var hasAllergen = vm.customerAllergies.some(function(allergen) {
                    return pizza.allergens && pizza.allergens.includes(allergen);
                });

                if (hasAllergen) {
                    if (!confirm('Warning: This pizza contains ingredients you are allergic to. Continue?')) {
                        return;
                    }
                }
            }

            pizza.calculatePrice = function() {
                return parseFloat(vm.calculatePizzaPrice(pizza));
            };

            CartService.addItem(pizza, 1);
            vm.success = 'Added ' + pizza.name + ' to cart!';
            setTimeout(function() {
                vm.success = '';
                vm.$apply();
            }, 2000);
        };

        vm.toggleTopping = function(topping) {
            var index = vm.customPizza.toppingIds.indexOf(topping.id);
            if (index > -1) {
                vm.customPizza.toppingIds.splice(index, 1);
            } else {
                vm.customPizza.toppingIds.push(topping.id);
            }
        };

        vm.isToppingSelected = function(topping) {
            return vm.customPizza.toppingIds.indexOf(topping.id) > -1;
        };

        vm.createCustomPizza = function() {
            if (!vm.customPizza.name) {
                vm.error = 'Please name your pizza';
                return;
            }

            PizzaService.createCustomPizza(vm.customPizza).then(function(response) {
                vm.success = 'Custom pizza created!';
                vm.pizzas.push(response.data);
                vm.customPizza = {
                    name: '',
                    size: 'medium',
                    basePrice: 8.99,
                    toppingIds: []
                };
            }).catch(function(error) {
                vm.error = 'Error creating pizza: ' + (error.data ? error.data.error : '');
            });
        };

        vm.init();
    }]);
