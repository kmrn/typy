//typy.js
// game controller and realtime functions

app.factory("Library", ["$firebaseArray",
    function($firebaseArray) {
        return function() {
            var ref = new Firebase("https://typy.firebaseio.com/library/");
            var library = $firebaseArray(ref);



            var phrase = "The quick brown fox.";

            return phrase;
        }
    }
]);

app.factory("Games", ["$firebaseArray", 
    function($firebaseArray) {
        return function() {
            var ref = new Firebase("https://typy.firebaseio.com/games/");
            return $firebaseArray(ref);
        }
    }
]);

app.factory("GameObject", ["$firebaseObject",
    function($firebaseObject) {
        return function() {
            var randomRoomId = Math.round(Math.random() * 100000000);
            var ref = new Firebase("https://typy.firebaseio.com/games/" + randomRoomId);
            return $firebaseObject(ref);
        }
    }
]);

app.controller("gameCtrl", ["$scope", "Auth", "Profile", "Library", "Games", "GameObject",
    function($scope, Auth, Profile, Library, Games, GameObject) {

        $scope.auth = Auth;

        if (Auth.$getAuth() !== null) {
            $scope.user = Profile(Auth.$getAuth().uid);
        }

        // any time auth status updates, add the user data to scope
        $scope.auth.$onAuth(function(authData) {
            $scope.authData = authData;
        });

        $scope.game;


        $scope.newGame = function() {
            $scope.game = GameObject();

            $scope.game.$bindTo($scope, "game").then( function(ref) {
                $scope.game.phrase = Library();
                $scope.game.player1 = $scope.user.displayName;
                $scope.game.player2 = null;
                $scope.game.input1 = null;
                $scope.game.input2 = null;
                $scope.game.countdown = 10;

                console.log("new game created");
            });
        }

        $scope.player2Bind = function() {
            $scope.game.$bindTo($scope, "game").then( function(ref) {
                $scope.game.player2 = $scope.user.displayName;
                console.log("game joined as player 2");
            });
        }

        $scope.findGame = function() {
            var games = Games();
            var joined = false;
            games.$loaded().then(function(games) {

                for(var i = 0, len = games.length; i < len; i++) {
                    if (games[i].player2 === null) {
                        joined = true;
                        player2Bind();
                    }
                }

                if (!joined) {
                    newGame();
                }
            });
        }

        $scope.findGame();

        $scope.update1 = function() {
            console.log("update1 was called");
        }

        $scope.update2 = function() {
            console.log("update2 was called");
        }   
    }
]);
