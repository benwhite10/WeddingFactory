$(document).ready(function(){
    updateGuestList();
});

function updateGuestList() {
    var infoArray = {
        type: "ALL_GUESTS"
    };

    $.ajax({
        type: "POST",
        data: infoArray,
        url: "requests/guest_list.php",
        dataType: "json",
        success: storeGuestList,
        error: function(){
            console.log("There was an error retrieving the guest list.");
        }
    }); 
}

function storeGuestList(json) {
    if(json["success"]) {
        // Store guest list
        sessionStorage.setItem("guests", JSON.stringify(json["result"]));
        calculateSummary();
        // Parse lists
        parseSummary();
        parseGuestList('INVITE', 'DAY', 'EVENING');
    } else {
        console.log("There was an error retrieving the guest list.");
        console.log(json["message"]);
    }
}

function calculateSummary() {
    var guests = JSON.parse(sessionStorage.getItem("guests"));
    var summary = {
        adults_day: 0,
        adults_evening: 0,
        children_over_day: 0,
        children_over_evening: 0,
        children_under_day: 0,
        children_under_evening: 0
    };
    for (var i = 0; i < guests.length; i++) {
        var invite = guests[i]["INVITE"];
        var age = guests[i]["AGE"];
        var text;
        if (age === 'ADULT') {
            text = 'adults_';
        } else if (age > 4) {
            text = 'children_over_';
        } else {
            text = 'children_under_';
        }
        text += invite === 'DAY' ? 'day' : 'evening';
        summary[text]++;
    }
    sessionStorage.setItem('guests_summary', JSON.stringify(summary));
}

function parseSummary() {
    var summary = JSON.parse(sessionStorage.getItem("guests_summary"));
    for (var key in summary) {
        var elem = document.getElementById(key);
        if (elem) {
            elem.innerHTML = summary[key];
        }
    }
}

function parseGuestList(filter, primary, secondary) {
    var guests = JSON.parse(sessionStorage.getItem("guests"));
    var primaryStr = "<div class='display_list_title'><h3>" + capitalizeFirstLetter(primary) + "</h3></div>";
    var secondaryStr = "<div class='display_list_title'><h3>" + capitalizeFirstLetter(secondary) + "</h3></div>";;
    for (var i = 0; i < guests.length; i++) {
        var guest = guests[i];
        var filterVar = guest[filter];
        var str = "<div class='guest_item' ";
        str += "onclick='location.href=\x22guest.html?uid=" + guest["ID"] + "\x22;'><p>";
        str += guest["FIRST_NAME"] + " " + guest["SURNAME"];
        str += "</p></div>";;
        if (filterVar === primary) {
            primaryStr += str;
        } else if (filterVar === secondary) {
            secondaryStr += str;
        }
        document.getElementById("display_list_primary").innerHTML = primaryStr;
        document.getElementById("display_list_secondary").innerHTML = secondaryStr;
    }
}

function capitalizeFirstLetter(inputString) {
    var string = inputString.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}