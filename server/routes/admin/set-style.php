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

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));


  $config->style->color = $_POST["color"];
  $config->style->pageTitle = $_POST["pageTitle"];
  $config->style->favicon = $_POST["favicon"];
  $config->style->logo = $_POST["logo"];

  $jsonData = json_encode($config, JSON_PRETTY_PRINT);
  file_put_contents(dirname(__DIR__, 2) . '/config.json', $jsonData);

  http_response_code(200);
  echo json_encode(array("message" => "Successfully updated style config."));
?>
