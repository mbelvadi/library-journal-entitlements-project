<?php
  require('../../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));

  if ($config->adminSetup) {
    http_response_code(200);
  } else {
    http_response_code(400);
  }
?>