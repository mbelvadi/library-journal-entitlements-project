<?php
  require('../../database/util/delete-spreadsheet-data.php');
  require('../../util/error-handling.php');
  require('../../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);

  if(!isset($_POST["adminKey"])) {
    http_response_code(401);
    echo json_encode(array("error" => $_POST));
    return false;
  }

  $isValidAdmin = validAdmin($_POST["adminKey"], '../../database/admin.db');
  if(!$isValidAdmin) return;

  if (isDatabaseLocked()) {
    http_response_code(503);
    echo json_encode(array("error" => "Database is locked by another process. Please try again later. Note if you think the database is incorrectly locked then it will automatically unlock in 2 hours."));
    return;
  }
  lockDatabase();

  $filesToDelete = json_decode($_POST["filesToDelete"]);

  foreach ($filesToDelete as $file) {
    deleteSpreadsheetData($file);
    if(is_file("../../PAR-files/$file")) {
      unlink("../../PAR-files/$file");
    }
  }

  unlockDatabase();
  $remainingFiles = getXLSXFiles('../../PAR-files/');
  echo json_encode(array("files" => $remainingFiles));
?>
