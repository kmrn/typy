//auth.js
// user authentication logic goes here

app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase("https://typy.firebaseio.com/");
        return $firebaseAuth(ref);
    }
]);

app.factory("Profile", ["$firebaseObject",
    function($firebaseObject) {
        return function(uid) {
            // create a reference to the Firebase database where we will store our data
            var ref = new Firebase("https://typy.firebaseio.com/users/");
            var profileRef = ref.child(uid);

            // return it as a synchronized object
            return $firebaseObject(profileRef);
        }
    }
]);

app.controller("authCtrl", ["$scope", "Auth", "Profile",
    function($scope, Auth, Profile) {

        $scope.auth = Auth;

        if (Auth.$getAuth() !== null) {
            $scope.user = Profile(Auth.$getAuth().uid);
        }

        // any time auth status updates, add the user data to scope
        $scope.auth.$onAuth(function(authData) {
            $scope.authData = authData;
        });
            
        // $scope.userExists = function(userId) {
        //     var usersRef = new Firebase("https://typy.firebaseio.com/users/");
        //     usersRef.child(userId).once('value', function(snapshot) {
        //         return (snapshot.val().displayName !== null);
        //     });
        // }

        $scope.login = function() {
            
            $scope.error = null;

            Auth.$authWithPassword({
                email: $scope.email,
                password: $scope.password
            }).then(function(authData) {
                console.log("Logged in as: ", authData.uid);
                user = Profile(Auth.$getAuth().uid)
                window.location.replace("/dashboard.html");
            }).catch(function(error) {
                var element = angular.element( document.querySelector('.invalid') );
                switch (error.code) {
                    case "INVALID_EMAIL":
                        element.removeClass("hidden");
                        break;
                    case "INVALID_PASSWORD":
                        element.removeClass("hidden");
                        break;
                    case "INVALID_USER":
                        element.removeClass("hidden");
                        break;
                    default:
                        element.removeClass("hidden");
                        break;
                }
                console.error("Authentication failed: ", error);
            });
        };

        $scope.createUser = function() {
            $scope.error = null;

            Auth.$createUser({
                email: $scope.email,
                password: $scope.password
            }).then(function(authData) {
                console.log("User created with id: ", authData.uid);
                user = Profile(authData.uid);
                user.displayName = $scope.displayName;
                user.wins = 0;
                user.losses = 0;
                user.gold = false;
                user.$save().then(function(ref) {
                    ref.key() === user.$id; // true
                }, function(error) {
                    console.log("Error:", error);
                });
                $scope.login();
            }).catch(function(error) {
                var element = angular.element( document.querySelector('.invalid') );
                switch (error.code) {
                    case "EMAIL_TAKEN":
                        element.removeClass("hidden");
                        break;
                    default:
                        element.removeClass("hidden");
                        break;
                }
                console.error("Authentication failed: ", error);
            });
        };


        $scope.logout = function() {
            Auth.$unauth();
            window.location.replace("/");
        };

        authData = Auth.$getAuth();
        

        $scope.authStatus = function() {
            if (authData) {
                return true;
            } else {
                return false;
            }
        }

        //user = Profile(authData.uid);


        if (authData) {
            if (window.location.pathname == '/login.html' || window.location.pathname == '/signup.html') {
                window.location.replace('/dashboard.html');
            }
            

        } else {
            if (window.location.pathname == '/dashboard.html') {
                window.location.replace('/login.html');
            }
        }
    }
]);

