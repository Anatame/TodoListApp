module.exports.getDate = getDate;


function getDate(){

var today = new Date();
var currentDay = today.getDay();
var day = "";

var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
};

day = today.toLocaleDateString("en-us", options)

return day;

}