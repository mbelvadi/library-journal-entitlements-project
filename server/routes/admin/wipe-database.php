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

  $isValidAdmin = validAdmin($_GET["adminKey"], '../../database/admin.db');
  if(!$isValidAdmin) return;

  if (isDatabaseLocked()) {
    http_response_code(503);
    echo json_encode(array("error" => "Database is locked by another process. Please try again later. Note if you think the database is incorrectly locked then it will automatically unlock in 2 hours."));
    return;
  }
  lockDatabase();

  wipeDatabase();

  $files = glob('../../PAR-files/*');
  foreach($files as $file){ 
    if(is_file($file)) {
      unlink($file);
    }
  }

  unlockDatabase();
  $remainingFiles = getXLSXFiles('../../PAR-files/');
  echo json_encode(array("files" => $remainingFiles));
?>