<?php

$include_path = '/Users/benwhite/Dropbox/Wedding/Website/WeddingFactory';
include_once $include_path . '/includes/db_functions.php';

$requestType = filter_input(INPUT_POST,'type',FILTER_SANITIZE_STRING);

switch ($requestType){
    case "ALL_GUEST_NAMES":
        getAllGuestNames();
        break;
    default:
        failRequest("There was a problem with your request, please try again.");
        break;
}

function getAllGuestNames() {
    $query = "SELECT FIRST_NAME, SURNAME FROM GUESTS";
    try {
        $guests = db_select_exception($query);
        succeedRequest($guests);
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
        "success" => FALSE);
    echo json_encode($response);
    exit();
}
