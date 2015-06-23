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

app.factory("GetGame", ["$firebaseObject", 
    function($firebaseObject) {
        return function(gameId) {
            var ref = new Firebase("https://typy.firebaseio.com/games/" + gameId);
            return $firebaseObject(ref);
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

app.controller("gameCtrl", ["$scope", "$interval", "Auth", "Profile", "Library", "Games", "GetGame", "GameObject",
    function($scope, $interval, Auth, Profile, Library, Games, GetGame, GameObject) {

        $scope.auth = Auth;

        if (Auth.$getAuth() !== null) {
            $scope.user = Profile(Auth.$getAuth().uid);
        }

        // any time auth status updates, add the user data to scope
        $scope.auth.$onAuth(function(authData) {
            $scope.authData = authData;
        });

        $scope.game;

        $scope.count = function() {
            $scope.game.countdown -= 1;
        }

        $scope.newGame = function() {
            $scope.game = GameObject();

            $scope.game.$bindTo($scope, "game").then( function(ref) {
                $scope.game.phrase = Library();
                $scope.game.player1 = $scope.user.displayName;
                $scope.game.player2 = "...";
                $scope.game.input1 = null;
                $scope.game.input2 = null;
                $scope.game.countdown = 10;

                // setInterval(function() {
                //     console.log("delayed");
                // }, 1000);

                console.log("new game created");
            });
        }

        $scope.findGame = function() {
            var games = Games();
            var joined = false;
            games.$loaded().then(function(games) {

                for(var i = 0, len = games.length; i < len; i++) {
                    if (games[i].player2 === "...") {
                        joined = true;
                        $scope.game = GetGame(games[i].$id);
                        $scope.game.$bindTo($scope, "game").then( function(ref) {
                            if ($scope.game.player1 === $scope.user.displayName) {
                                joined = false;
                                $scope.game.$remove();
                            } else {
                                $scope.game.player2 = $scope.user.displayName;

                                $interval( function() {
                                    $scope.game.countdown--;
                                }, 1000, 10);
                                console.log("game joined as player 2");
                            }
                        });
                        //$scope.player2Bind($scope.game);
                    }
                }

                if (!joined) {
                    $scope.newGame();
                }
            });
        }

        $scope.isDisabled = function() {
            if ($scope.game != undefined)
                if ($scope.game.input1 === $scope.game.phrase || $scope.game.input2 === $scope.game.phrase)
                    return true;
        }

        $scope.destroyGame = function() {
            $scope.game.$remove();
        }

        $scope.findGame();

        function closeIt()
        {
            $scope.game.$remove();
            return "Any string value here forces a dialog box to \n" + 
                "appear before closing the window.";
        }
        window.onbeforeunload = closeIt;
        // window.onbeforeunload = function(){
        //     $scope.game.$remove().then(function(ref) {
        //     }, function(error) {
        //     });
        // }
        // $scope.$on('$locationChangeStart', function(event, next, current) {
        //     $scope.game.$remove().then(function(ref) {
        //     }, function(error) {
        //     });
        // });
    }
]);

// angular.module("", []).directive('confirmOnExit', function() {
//     return {
//         link: function($scope, elem, attrs) {
//             window.onbeforeunload = function(){
//                 if ($scope.myForm.$dirty) {
//                     return "The form is dirty, do you want to stay on the page?";
//                 }
//             }
//             $scope.$on('$locationChangeStart', function(event, next, current) {
//                 if ($scope.myForm.$dirty) {
//                     if(!confirm("The form is dirty, do you want to stay on the page?")) {
//                         event.preventDefault();
//                     }
//                 }
//             });
//         }
//     };
// });