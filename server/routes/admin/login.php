<?php
  require('../../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));

  $data = json_decode(file_get_contents("php://input"));

  if (password_verify($data->password, $config->adminPassword)) {
    http_response_code(200);
    echo json_encode(array("message" => "Correct password."));
    
  } else {
    http_response_code(400);
    echo json_encode(array("error" => "Incorrect password."));
  }
?>