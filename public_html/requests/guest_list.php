<?php

//$include_path = '/Users/benwhite/Dropbox/Wedding/Website/WeddingFactory';
$include_path = '/var/WeddingFactory';
include_once $include_path . '/includes/db_functions.php';

$requestType = filter_input(INPUT_POST,'type',FILTER_SANITIZE_STRING);
$userid = filter_input(INPUT_POST, 'uid', FILTER_SANITIZE_NUMBER_INT);
$first_name = filter_input(INPUT_POST,'first_name',FILTER_SANITIZE_STRING);
$surname = filter_input(INPUT_POST,'surname',FILTER_SANITIZE_STRING);
$invite = filter_input(INPUT_POST,'invite',FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST,'email',FILTER_SANITIZE_STRING);
$age = filter_input(INPUT_POST,'age',FILTER_SANITIZE_STRING);
$number = filter_input(INPUT_POST,'number',FILTER_SANITIZE_STRING);
$address_id = filter_input(INPUT_POST, 'address_id', FILTER_SANITIZE_NUMBER_INT);
$address1 = filter_input(INPUT_POST,'address1',FILTER_SANITIZE_STRING);
$address2 = filter_input(INPUT_POST,'address2',FILTER_SANITIZE_STRING);
$address3 = filter_input(INPUT_POST,'address3',FILTER_SANITIZE_STRING);
$town = filter_input(INPUT_POST,'town',FILTER_SANITIZE_STRING);
$county = filter_input(INPUT_POST,'county',FILTER_SANITIZE_STRING);
$postcode = filter_input(INPUT_POST,'postcode',FILTER_SANITIZE_STRING);
$country = filter_input(INPUT_POST,'country',FILTER_SANITIZE_STRING);

switch ($requestType){
    case "ALL_GUESTS":
        getAllGuests();
        break;
    case "GUEST_INFO":
        getGuestInformation($userid);
        break;
    case "UPDATE_DETAILS":
        updateDetails($userid, $first_name, $surname, $invite, $email, $age, $number);
        break;
    case "UPDATE_ADDRESS":
        updateAddress($address_id, $address1, $address2, $address3, $town, $county, $postcode, $country);
        break;
    case "NEW_ADDRESS":
        newAddress($userid, $address1, $address2, $address3, $town, $county, $postcode, $country);
        break;
    default:
        failRequest("Invalid request type received.");
        break;
}

function getAllGuests() {
    $query = "SELECT * FROM GUESTS";
    try {
        succeedRequest(db_select_exception($query));
    } catch (Exception $ex) {
        failRequest($ex->getMessage());
    }
}

function getGuestInformation($userid) {
    $query = "SELECT G.*, ADDRESS_LINE_1, ADDRESS_LINE_2, ADDRESS_LINE_3, TOWN, COUNTY, POSTCODE, COUNTRY FROM GUESTS G "
            . "LEFT JOIN ADDRESS A ON G.ADDRESS_ID = A.ID "
            . "WHERE G.ID = $userid";
    try {
        $result = db_select_exception($query);
        if (count($result) > 0) {
            succeedRequest($result[0]);
        } else {
            failRequest("No information returned for user with id: $userid");
        }
    } catch (Exception $ex) {
        failRequest($ex->getMessage());
    }
}

function updateDetails($userid, $first_name, $surname, $invite, $email, $age, $number) {
    $query = "UPDATE GUESTS SET "
            . "FIRST_NAME = '$first_name', "
            . "SURNAME = '$surname', "
            . "INVITE = '$invite', "
            . "EMAIL = '$email', "
            . "AGE = '$age' "
            . "WHERE ID = $userid";
    try {
        db_query_exception($query);
        succeedRequest();
    } catch (Exception $ex) {
        failRequest($ex->getMessage());
    }
}

function updateAddress($address_id, $address1, $address2, $address3, $town, $county, $postcode, $country) {
    $query = "UPDATE ADDRESS SET "
            . "ADDRESS_LINE_1 = '$address1', "
            . "ADDRESS_LINE_2 = '$address2', "
            . "ADDRESS_LINE_3 = '$address3', "
            . "TOWN = '$town', "
            . "COUNTY = '$county', "
            . "POSTCODE = '$postcode', "
            . "COUNTRY = '$country' "
            . "WHERE ID = $address_id;";
    try {
        db_query_exception($query);
        succeedRequest();
    } catch (Exception $ex) {
        failRequest($ex->getMessage());
    }
}

function newAddress($userid, $address1, $address2, $address3, $town, $county, $postcode, $country) {
    $query = "INSERT INTO ADDRESS "
            . "(ADDRESS_LINE_1, ADDRESS_LINE_2, ADDRESS_LINE_3, TOWN, COUNTY, POSTCODE, COUNTRY) VALUES "
            . "('$address1', '$address2', '$address3', '$town', '$county', '$postcode', '$country');";
    try {
        db_begin_transaction();
        $result = db_insert_query_exception($query);
        $address_id = $result[1];
        $query = "UPDATE GUESTS SET ADDRESS_ID = $address_id WHERE ID = $userid";
        db_query_exception($query);
        db_commit_transaction();
        succeedRequest();
    } catch (Exception $ex) {
        db_rollback_transaction();
        failRequest($ex->getMessage());
    }
}
function succeedRequest($result){
    $response = array(
        "success" => TRUE,
        "result" => $result);
    echo json_encode($response);
    exit();
}

function failRequest($message){
    $response = array(
        "success" => FALSE,
        "message" => $message);
    echo json_encode($response);
    exit();
}
