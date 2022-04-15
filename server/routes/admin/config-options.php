<?php
  require('../../database/util/wipe-db.php');
  require('../../util/error-handling.php');
  require('../../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));

  http_response_code(200);
  echo json_encode(array("url" => $config->crknURL, "school" => $config->school, "includeNoRights" => $config->includeNoRightsInSearchResults, "helpURL" => $config->helpURL));
?>