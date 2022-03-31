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

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));

  http_response_code(200);
  echo json_encode($config->crknURL);
?>