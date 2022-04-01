<?php
  require('../../util/error-handling.php');
  require('../../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);

  if(!isset($_GET["adminKey"])) {
    http_response_code(400);
    echo json_encode(array("error" => "admin key is required."));
    return;
  }

  $isValidAdmin = validAdmin($_GET["adminKey"], '../../database/admin.db');
  if(!$isValidAdmin) return;

  $db = new SQLite3('../../database/admin.db');
  $db->exec("DELETE FROM ADMIN_TOKENS");
  $db->close();

  echo json_encode(array("message" => "Succesfully logged out."));
?>
