//main.js
//all main initializations and stuff will go here

var app = angular.module("typy", ["firebase"]);

window.onload = function() {
    setTimeout(function() {
        var ad = document.querySelector("ins.adsbygoogle");
        if (ad && ad.innerHTML.replace(/\s/g, "").length == 0) {
            ad.style.cssText = 'display:block !important; text-decoration: none';
            ad.innerHTML = "<h5>Know what would be awesome?</h5><p>If you disabled adblock. If you don't want to support us that way, at least contribute to our patreon for a guilt free Typy experience.</p>";
        }
    }); 
}; 