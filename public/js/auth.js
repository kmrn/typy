//auth.js
// user authentication logic goes here

app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase("https://typy.firebaseio.com");
        return $firebaseAuth(ref);
    }
]);

app.controller("authCtrl", ["$scope", "Auth",
    function($scope, Auth) {

        $scope.authData = null;

        $scope.login = function() {
            
            $scope.error = null;

            Auth.$authWithPassword({
                email: $scope.email,
                password: $scope.password
            }).then(function(authData) {
                console.log("Logged in as: ", authData.uid);
                window.location.replace("/");
            }).catch(function(error) {
                console.error("Authentication failed: ", error);
            });
        };


        $scope.createUser = function() {
            $scope.error = null;

            Auth.$createUser({
                username: $scope.username,
                email: $scope.email,
                password: $scope.password
            }).then(function(authData) {
                $scope.message = "User created with uid: " + authData.uid;
            }).catch(function(error) {
                $scope.error = error;
            });
        };

        // $scope.removeUser = function() {
        //     $scope.message = null;
        //     $scope.error = null;

        //     Auth.$removeUser({
        //         email: $scope.email,
        //         passsword: $scope.password
        //     }).then(function() {
        //         $scope.message = "User removed";
        //     }).catch(function(error) {
        //         $scope.error = error;
        //     });
        // };


        // if ($scope.authData) {
        //     console.log("User " + authData.uid + " is logged in with " + authData.provider);
        // } else {
        //     console.log("User is logged out");
        // }

        $scope.logout = function() {
            Auth.$unauth();
            window.location.replace("/");
        };

        authData = Auth.$getAuth();
    }
]);