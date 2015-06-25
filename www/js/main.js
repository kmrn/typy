//main.js
//all main initializations and stuff will go here

var app = angular.module("typy", ["firebase"]);

window.onload = function() {
    setTimeout(function() {
        var ad = document.querySelector("ins.adsbygoogle");
        if (ad && ad.innerHTML.replace(/\s/g, "").length == 0) {
            ad.style.cssText = 'display:block !important; text-decoration: none';
            ad.innerHTML = "<h5>Did you know you can disable ads and still support Typy by buying <u>Typy Gold</u>?</h5> It's true! Every Typy Gold subscriber gets no ads and the warm fuzzy feeling of supporting content you use. I do this for a living man, come on. <hr><a href='/gold.html' class='button button-primary'>Get Gold</a>";
        }
    }); 
}; 