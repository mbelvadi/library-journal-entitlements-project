<?php
  require('../../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);

  $data = json_decode(file_get_contents("php://input"));

  if(!isset($_POST["adminKey"])) {
    http_response_code(401);
    echo json_encode(array("error" => "admin key is required."));
    return;
  }

  $adminKey = $_POST["adminKey"];
  $db = new SQLite3('../../database/ljp.db');
  $results = $db->query("SELECT * FROM ADMIN_TOKENS WHERE token = '$adminKey' AND valid_till >= strftime('%s', 'now')");
  $resultsArray = array();
  while ($res= $results->fetchArray(1)) {
    array_push($resultsArray, $res);
  }

  if(count($resultsArray) !== 1) {
    http_response_code(401);
    echo json_encode(array("error" => "invalid admin key. Please login again."));
    return;
  }

  echo json_encode(array("adminKey"=> $_POST["adminKey"], "file" => $_FILES["file"]));
?>