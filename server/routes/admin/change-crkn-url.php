<?php
  require('../../util/error-handling.php');
  require('../../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);

  if(!isset($_POST["adminKey"])) {
    http_response_code(401);
    echo json_encode(array("error" => "admin key is required."));
    return;
  }
  $isValidAdmin = validAdmin($_POST["adminKey"], '../../database/admin.db');
  if(!$isValidAdmin) return;
  if (!isset($_POST["url"])) {
    http_response_code(400);
    echo json_encode(array("error" => "Invalid request."));
    return;
  }

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));
  $config->crknURL = $_POST["url"];
  $jsonData = json_encode($config, JSON_PRETTY_PRINT);
  file_put_contents(dirname(__DIR__, 2) . '/config.json', $jsonData);

  http_response_code(200);
  echo json_encode(array("message" => "Successfully updated crkn URL."));
?>
