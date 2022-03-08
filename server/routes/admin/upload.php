<?php
  require('../../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);

  echo json_encode($_FILES["file"]);
?>