<?php
  require('../../database/util/wipe-db.php');
  require('../../util/error-handling.php');
  require('../../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);

  if(!isset($_POST["adminKey"])) {
    http_response_code(401);
    echo json_encode(array("error" => "admin key is required."));
    return;
  }
 
  $isValidAdmin = validAdmin($_POST["adminKey"], '../../database/ljp.db');
  if(!$isValidAdmin) return;

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));


  $config->school = $_POST["school"];
  $jsonData = json_encode($config, JSON_PRETTY_PRINT);
  file_put_contents(dirname(__DIR__, 2) . '/config.json', $jsonData);

  wipeDatabase();

  $files = glob('../../PAR-files/*');
  foreach($files as $file){ 
    if(is_file($file)) {
      unlink($file);
    }
  }


  http_response_code(200);
  echo json_encode(array("message" => "Successfully updated school."));
?>