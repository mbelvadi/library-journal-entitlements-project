<?php
  require('../util/error-handling.php');
  require('../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);
  
  $files = getXLSXFiles('../PAR-files/');
  echo json_encode($files);
?>