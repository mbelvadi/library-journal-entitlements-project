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
  $isValidAdmin = validAdmin($_POST["adminKey"], '../../database/admin.db');
  if(!$isValidAdmin) return;
  if (!isset($_POST["school"])) {
    http_response_code(400);
    echo json_encode(array("error" => "Invalid request."));
    return;
  }
  // School name affects upload process of data so we will only change when database is unlocked
  if (isDatabaseLocked()) {
    http_response_code(503);
    echo json_encode(array("error" => "Database is locked by another process. Please try again later. Note if you think the database is incorrectly locked then it will automatically unlock in 2 hours."));
    return;
  }
  lockDatabase();

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

  unlockDatabase();
  http_response_code(200);
  echo json_encode(array("message" => "Successfully updated school."));
?>
