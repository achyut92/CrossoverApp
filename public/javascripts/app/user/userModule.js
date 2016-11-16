var app = angular.module('userModule', []);

app.controller('userRegisterContoller', function ($scope, $http, $window,User) {
    $scope.register = function (user,isValid) {

        if (isValid) {
            User.register(user).
                success(function (data) {
                    console.log('register success - ' + data);
                    $window.location.href = '/users/login';
                    $scope.alert = 'alert alert-info';
                    $scope.errorMessage = 'Registered Successfully. Please Login.';
                   
                }).
                error(function (data) {
                    $scope.user = {};
                })
        } else {
            console.log('empty values');
        }
        
    }
});

app.controller('userLoginContoller', function ($scope, $http, $window,User) {
    $scope.login = function (user, isValid) {

        if (isValid) {
            console.log(user);
            User.login(user).
                success(function (data) {
                    console.log('login success');
                    $window.location.href = '/';
                }).
                error(function (data) {
                    console.log(data);
                    $scope.user = {};
                })
        } else {
            console.log('empty values');
        }

    }
});


app.factory('User', function ($http) {
    return {
        login: function (user) {
            return $http.post('/users/loginUser', user);
        },

        register: function (user) {
            return $http.post('/users/registerUser', user);
        }
    }
});