var app = angular.module('productListModule', []);

app.controller('productListContoller', function ($scope, $http, Products) {
    Products.get()
        .success(function (response) {
            console.log(response);
        var productChunk = [];
        var chunkSize = 3;
        for (var i = 0; i < response.length; i += chunkSize) {
            productChunk.push(response.slice(i, i + chunkSize));
        }
        
        $scope.products = productChunk;

    }).error(function (response) { })
   });

app.factory('Products', function ($http) {
    return {
        get: function () {
            return $http.get('/products/all-products');
        }

    }
});

