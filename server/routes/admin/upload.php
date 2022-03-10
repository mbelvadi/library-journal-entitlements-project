<?php
  require('../../database/util/ingest-spreadsheets.php');
  require('../../database/util/delete-crkn-data.php');
  require('../../util/error-handling.php');
  require('../../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);

  if(!isset($_POST["adminKey"])) {
    http_response_code(401);
    echo json_encode(array("error" => "admin key is required."));
    return;
  }

  $isValidAdmin = validAdmin($_POST["adminKey"], '../../database/ljp.db');
  if(!$isValidAdmin) return;

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