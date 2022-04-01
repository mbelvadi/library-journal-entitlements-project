<?php
  require('../../database/util/wipe-db.php');
  require('../../util/error-handling.php');
  require('../../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);

  if(!isset($_GET["adminKey"])) {
    http_response_code(401);
    echo json_encode(array("error" => "admin key is required."));
    return;
  }

  $isValidAdmin = validAdmin($_GET["adminKey"], '../../database/ljep.db');
  if(!$isValidAdmin) return;

  wipeDatabase();

  $files = glob('../../PAR-files/*');
  foreach($files as $file){
    if(is_file($file)) {
      unlink($file);
    }
  }

  $remainingFiles = getXLSXFiles('../../PAR-files/');
  echo json_encode(array("files" => $remainingFiles));
?>
