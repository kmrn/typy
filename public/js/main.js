//main.js
//all main initializations and stuff will go here

var app = angular.module("typy", ["firebase"]);

window.onload = function() {
    setTimeout(function() {
        var ad = document.querySelector("ins.adsbygoogle");
        if (ad && ad.innerHTML.replace(/\s/g, "").length == 0) {
            ad.style.cssText = 'display:block !important; text-decoration: none';
            ad.innerHTML = "<h5>Ads</h5><p>aren't that great, not gonna lie. But Typy isn't free to host and took a lot of effort to make. We'd appreciate it if you turned off adblock. Thanks!</p><p>- Kamran</p>";
        }
    }); 
}; 