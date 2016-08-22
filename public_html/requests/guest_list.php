<?php

//$include_path = '/Users/benwhite/Dropbox/Wedding/Website/WeddingFactory';
$include_path = '/var/WeddingFactory';
include_once $include_path . '/includes/db_functions.php';

$requestType = filter_input(INPUT_POST,'type',FILTER_SANITIZE_STRING);

switch ($requestType){
    case "ALL_GUESTS":
        getAllGuests();
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
