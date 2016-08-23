$(document).ready(function(){
    getGuestInformation();
});

function getGuestInformation() {
    var userid = getQueryStringValue('uid');
    
    var infoArray = {
        type: "GUEST_INFO",
        uid: userid
    };

    $.ajax({
        type: "POST",
        data: infoArray,
        url: "requests/guest_list.php",
        dataType: "json",
        success: function(json) {
            storeGuestInfo(json);
            parseDetails();
        },
        error: function(){
            console.log("There was an error retrieving the guest list.");
        }
    }); 
}

function storeGuestInfo(json) {
    if(json["success"]) {
        sessionStorage.setItem("guest_info", JSON.stringify(json["result"]));
        console.log(json["result"]);
    } else {
        console.log("There was an error retrieving the guest information.");
        console.log(json["message"]);
    }
}

function parseDetails() {
    var guestInfo = JSON.parse(sessionStorage.getItem("guest_info"));
    // Title
    $("#main_name").html('<h1>' + guestInfo["FIRST_NAME"] + ' ' + guestInfo["SURNAME"] + '</h1>');
    // Information
    for (var key in guestInfo) {
        $("[name='" + key + "']").val(guestInfo[key]);
    }
}

function saveDetails() {
    var userid = getQueryStringValue('uid');
    updateDetailsButton("SAVING");
    
    var infoArray = {
        type: "UPDATE_DETAILS",
        uid: userid,
        first_name: $("[name='FIRST_NAME']").val(),
        surname: $("[name='SURNAME']").val(),
        invite: $("[name='INVITE']").val(),
        email: $("[name='EMAIL']").val(),
        age: $("[name='AGE']").val(),
        number: $("[name='NUMBER']").val()
    };

    $.ajax({
        type: "POST",
        data: infoArray,
        url: "requests/guest_list.php",
        dataType: "json",
        success: function(json) {
            if (json["success"]) {
                updateDetailsButton("SAVED");
                getGuestInformation();
            } else {
                updateDetailsButton("ERROR");
                console.log(json["message"]);
            }
        },
        error: function(){
            updateDetailsButton("ERROR");
            console.log("There was an error in the save details request");
        }
    });
}

function updateDetailsButton(state) {
    if (state === "SAVING") {
        $("#save_details").html("<h3>Saving..</h3>");
    } else if (state === "SAVED") {
        $("#save_details").html("<h3>Saved</h3>");
    } else if (state === "SAVE") {
        $("#save_details").html("<h3>Save</h3>");
    } else {
        $("#save_details").html("<h3>Error - Try Again</h3>");
    }
}

function saveAddress() {
    var guestInfo = JSON.parse(sessionStorage.getItem("guest_info"));
    var user_id = guestInfo["ID"];
    var address_id = guestInfo["ADDRESS_ID"];
    updateAddressButton("SAVING");
    
    var infoArray = {
        address1: $("[name='ADDRESS_LINE_1']").val(),
        address2: $("[name='ADDRESS_LINE_2']").val(),
        address3: $("[name='ADDRESS_LINE_3']").val(),
        town: $("[name='TOWN']").val(),
        county: $("[name='COUNTY']").val(),
        postcode: $("[name='POSTCODE']").val(),
        country: $("[name='COUNTRY']").val()
    };
    
    if (address_id !== null && address_id !== "0") {
        infoArray["type"] = "UPDATE_ADDRESS";
        infoArray["address_id"] = address_id;
    } else {
        infoArray["type"] = "NEW_ADDRESS";
        infoArray["uid"] = user_id;
    }

    $.ajax({
        type: "POST",
        data: infoArray,
        url: "requests/guest_list.php",
        dataType: "json",
        success: function(json) {
            if (json["success"]) {
                updateAddressButton("SAVED");
            } else {
                updateAddressButton("ERROR");
                console.log(json["message"]);
            }
        },
        error: function(){
            updateAddressButton("ERROR");
            console.log("There was an error in the save details request");
        }
    });
}

function updateAddressButton(state) {
    if (state === "SAVING") {
        $("#save_address").html("<h3>Saving..</h3>");
    } else if (state === "SAVED") {
        $("#save_address").html("<h3>Saved</h3>");
    } else if (state === "SAVE") {
        $("#save_address").html("<h3>Save</h3>");
    } else {
        $("#save_address").html("<h3>Error - Try Again</h3>");
    }
}

function getQueryStringValue (key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}