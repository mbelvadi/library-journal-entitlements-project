<?php
  require('../../database/util/ingest-spreadsheets.php');
  require('../../database/util/delete-crkn-data.php');
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

  function move_file($path,$to){
    if(copy($path, $to)){
       unlink($path);
       return true;
    } else {
      return false;
    }
  }
  $newFilePath = "../../PAR-files/{$_FILES["file"]["name"]}";
  move_file($_FILES["file"]["tmp_name"], $newFilePath); 

  $uploadStartTime = time();
  ingestSpreadsheet($newFilePath, basename($newFilePath), 0);
  deleteOldCrknData('filename', $uploadStartTime, basename($newFilePath));

  echo json_encode(array("message" => "Successfully uploaded file.", "time" => $uploadStartTime));
?>