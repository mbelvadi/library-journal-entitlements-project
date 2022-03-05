<?php
  require('../../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));

  $data = json_decode(file_get_contents("php://input"));
  http_response_code(400);
  
  // 1. Password validation
  if ($data->adminCode !== $config->adminSetupCode) {
    echo json_encode(array("error" => "Admin setup code is invalid."));
    return;
  }

  if ($data->password !== $data->confirmPassword) {
    echo json_encode(array("error" => "Passwords do not match"));
    return;
  }
  
  if (strlen($data->password) < 6) {
    echo json_encode(array("error" => "Password must be at least 6 characters."));
    return;
  }
  
  // TODO 2. encrypt password
  $encryptedPassword = $data->password;

  // 3. update config file
  $config->adminSetup = true;
  $config->adminPassword = $encryptedPassword;
  $jsonData = json_encode($config, JSON_PRETTY_PRINT);
  file_put_contents(dirname(__DIR__, 2) . '/config.json', $jsonData);

  http_response_code(200);
  echo json_encode(array("message" => "Succesfully created admin account!"));
?>