<?php
  require('../../database/util/delete-crkn-data.php');
  require('../../util/error-handling.php');
  require('../../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);

  if(!isset($_POST["adminKey"])) {
    http_response_code(401);
    echo json_encode(array("error" => $_POST));
    return false;
  }

  $isValidAdmin = validAdmin($_POST["adminKey"], '../../database/ljp.db');
  if(!$isValidAdmin) return;

  $filesToDelete = json_decode($_POST["filesToDelete"]);

  foreach ($filesToDelete as $file) {
    deleteOldCrknData('filename', time(), $file);
    if(is_file("../../PAR-files/$file")) {
      unlink("../../PAR-files/$file");
    }
  }

  echo json_encode(array("message" => "Successfully deleted files", "files" => $filesToDelete));
?>