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
    updateButton("save_details", "SAVING");
    
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
                updateButton("save_details", "SAVED");
                getGuestInformation();
            } else {
                updateButton("save_details", "ERROR");
                console.log(json["message"]);
            }
        },
        error: function(){
            updateButton("save_details", "ERROR");
            console.log("There was an error in the save details request");
        }
    });
}

function saveAddress() {
    var guestInfo = JSON.parse(sessionStorage.getItem("guest_info"));
    var user_id = guestInfo["ID"];
    var address_id = guestInfo["ADDRESS_ID"];
    updateButton("save_address", "SAVING");
    
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
                updateButton("save_address", "SAVED");
            } else {
                updateButton("save_address", "ERROR");
                console.log(json["message"]);
            }
        },
        error: function(){
            updateButton("save_address", "ERROR");
            console.log("There was an error in the save details request");
        }
    });
}

function updateButton(id, state) {
    var saveText = id === "save_address" ? "saveAddress()" : "saveDetails()";
    id = "#" + id;
    $(id).removeClass("saving");
    $(id).removeClass("save");
    $(id).removeClass("saved");
    $(id).removeClass("error");
    if (state === "SAVING") {
        $(id).html("<h3>Saving..</h3>");
        $(id).addClass("saving");
        $(id).attr("onclick","");
        $(id).css("cursor", "default");
    } else if (state === "SAVED") {
        $(id).html("<h3>Saved &#10003</h3>");
        $(id).addClass("saved");
        $(id).attr("onclick","");
        $(id).css("cursor", "default");
    } else if (state === "SAVE") {
        $(id).html("<h3>Save</h3>");
        $(id).addClass("save");
        $(id).attr("onclick",saveText);
        $(id).css("cursor", "pointer");
    } else {
        $(id).html("<h3>Error - Try Again</h3>");
        $(id).addClass("error");
        $(id).attr("onclick",saveText);
        $(id).css("cursor", "pointer");
    }
}

function getQueryStringValue (key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}