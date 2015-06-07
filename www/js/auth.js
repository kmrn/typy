//auth.js
// user authentication logic goes here

var isNewUser = true;

var authRef = new Firebase("https://typy.firebaseio.com");
var authData = authRef.getAuth();

if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
    console.log("User is logged out");
}



// callback function
function authHandler(error, authData) {
    if (error) {
        console.log("Login Failed!", error);
    } else {
        console.log("Authenticated successfully with payload:", authData);

        window.location.href = "/";
    }
}


//login authentication
function authenticatePassword(userEmail, userPassword) {
    authRef.authWithPassword({
        email    : $('#login-email').val(),
        password : $('#login-password').val()
    }, authHandler);


}



// authRef.onAuth(function(authData) {
//     // if (authData && isNewUser) {
//     //     authRef.child("users").child(authData.uid).set({
//     //         provider: authData.provider,
//     //         name: getName(authData)
//     //     });
//     // }


// });

