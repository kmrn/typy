//typy.js
// game controller and realtime functions

app.factory("Library", ["$firebaseArray",
    function($firebaseArray) {
        return function() {
            var ref = new Firebase("https://typy.firebaseio.com/library/");
            return $firebaseArray(ref);
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
        return function(gameId, remove) {
            var ref = new Firebase("https://typy.firebaseio.com/games/" + gameId);
            var obj = $firebaseObject(ref);
            if (remove) {
                obj.$remove().then(function(ref) {
                    // data has been deleted locally and in the Firebase database
                }, function(error) {
                    console.log("Error:", error);
                });
            } else {
                return obj;
            }
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
        $scope.gameOver = false;

        $scope.count = function() {
            $scope.game.countdown -= 1;
        }

        $scope.newGame = function() {
            $scope.game = GameObject();

            $scope.game.$bindTo($scope, "game").then( function(ref) {
                //$scope.game.phrase = Library();
                Library().$loaded().then(function(library) {
                    $scope.game.phrase = library[Math.floor(Math.random() * library.length)].$value;
                });
                $scope.game.player1 = $scope.user.$id;
                $scope.game.player1name = $scope.user.displayName;
                $scope.game.player2 = "...";
                $scope.game.player2name = null;
                $scope.game.input1 = null;
                $scope.game.input2 = null;
                $scope.game.winner = null;
                $scope.game.countdown = 10;

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
                        $scope.game = GetGame(games[i].$id, false);
                        $scope.game.$bindTo($scope, "game").then( function(ref) {
                            if ($scope.game.player1 === $scope.user.$id) {
                                joined = false;
                            } else {
                                $scope.game.player2 = $scope.user.$id;
                                $scope.game.player2name = $scope.user.displayName;

                                $interval( function() {
                                    $scope.game.countdown--;
                                }, 1000, 10);
                                console.log("game joined as player 2");
                            }
                        });
                    }
                }

                if (!joined) {
                    $scope.newGame();
                }
            });
        }

        $scope.isDisabled = function() {
            if ($scope.game != undefined) {
                if ($scope.game.input1 === $scope.game.phrase || $scope.game.input2 === $scope.game.phrase) {
                    
                    if ($scope.game.input1 === $scope.game.phrase) {
                        $scope.game.winner = $scope.game.player1;
                        
                    }

                    if ($scope.game.input2 === $scope.game.phrase) {
                        $scope.game.winner = $scope.game.player2;                        $scope.gameOver = 1;
                    }

                    $scope.gameOver = true;
                    return true;
                }
            }
        }

        $scope.destroyGame = function() {
            GetGame($scope.game.$id, true);
            $scope.gameOver = false;

            return "Leaving this page ends the game. The game data for this round will be destroyed.";
        }

        if (authData) {
            $scope.findGame();
        }

        $scope.$watch('gameOver', function() {

            if ($scope.game.winner != undefined) {
                if ($scope.user.$id === $scope.game.winner) {
                    $scope.user.wins += 1;
                    $scope.user.$save();
                    console.log("you win");
                }

                if ($scope.user.$id !== $scope.game.winner) {
                    $scope.user.losses += 1;
                    $scope.user.$save();
                    console.log("you lose");
                }

                console.log("The game is over.");
            }
        });

        function closeIt()
        {
            if (authData) {
                return $scope.destroyGame();
            }
        }

        window.onbeforeunload = closeIt;
    }
]);
