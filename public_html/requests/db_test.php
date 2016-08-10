<?php

$host = 'localhost';
$username = 'root';
$password = 'password';
//$username = 'sec_user';
//$password = '4hu@smd9f';
$dbname = 'Smarkbook';
//$dbname = 'Wedding';

echo "1 \n";
//$query = "SELECT FIRST_NAME, SURNAME FROM GUESTS";
$query = "SELECT * FROM TGROUPWORKSHEETS";
echo $query . "\n";
try {
    $guests = db_select_exception($query);
    echo $guests . "\n";
    succeedRequest($guests);
} catch (Exception $ex) {
    failRequest($ex->getMessage());
}

function db_select_exception($query){
    $rows = array();
    $result = db_query_exception($query);

    while($row = mysqli_fetch_assoc($result)){
        $rows[] = $row;
    }
    return $rows;
}

function db_query_exception($query){
    $mysql = db_connect();
    $result = mysqli_query($mysql, $query);
    if(!$result){
        throw new Exception(mysqli_error($mysql), 150);
    }
    return $result;
}

function db_connect(){
    static $connection;
    global $host, $username, $password, $dbname;
    
    if(!isset($connection)){
        $connection = mysqli_connect($host,$username,$password,$dbname);

        if($connection == false){
            return mysqli_connect_error();
        }
    }

    return $connection;
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
