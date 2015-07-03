//leaderboard.js



// var leaderboardSize = 10;

// // Firebase Reference
// var scoreListRef = new Firebase('https://typy.firebaseio.com//scoreList');

// //map firebase locations to HTML elements
// var htmlForPath = {};

// //add row helper
// function handleScoreAdded(scoreSnapshot, prevScoreName) {
// 	var newScoreRow = $("<tr/>");
// 	newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val().name)));
// 	newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

// 	//store reference to table row
// 	htmlForPath[scoreSnapshot.key()] = newScoreRow;

// 	//insert new score in the appropriate place
// 	if (prevScoreName === null) {
// 		$("#leaderboardTable").append(newScoreRow);
// 	} else {
// 		var lowerScoreRow = htmlForPath[prevScoreName];
// 		lowerScoreRow.before(newScoreRow);
// 	}
// }

// function handleScoreRemoved(scoreSnapshot) {
// 	var removedScoreRow = htmlForPath[scoreSnapshot.key()];
// 	removedScoreRow.remove();
// 	delete htmlForPath[scoreSnapshot.key()];
// }

// var scoreListView = scoreListRef.limitToLast(leaderboardSize);


// scoreListView.on('child_added', function(newScoreSnapshot, prevScoreName) {
// 	handleScoreAdded(newScoreSnapshot, prevScoreName);
// });


// var changedCalback = function (scoreSnapshot, prevScoreName) {
// 	handleScoreRemoved(scoreSnapshot);
// }