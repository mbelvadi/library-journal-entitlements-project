<?php
  require('../../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));

  $data = json_decode(file_get_contents("php://input"));

  if (password_verify($data->password, $config->adminPassword)) {
    $adminKey = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));

    $db = new SQLite3('../../database/admin.db');
    $db->exec("DELETE FROM ADMIN_TOKENS");
    $db->exec("INSERT INTO ADMIN_TOKENS (token) VALUES ('$adminKey')");
    $db->close();

    http_response_code(200);
    echo json_encode(array("adminKey" => $adminKey));
    
  } else {
    http_response_code(400);
    echo json_encode(array("error" => "Incorrect password."));
  }
?>