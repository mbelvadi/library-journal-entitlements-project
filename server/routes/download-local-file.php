<?php
  require('../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);
  
  $data = json_decode(file_get_contents("php://input"));
  $file = (property_exists($data, "file")) ? $data->file : "";
  $filepath = "../PAR-files/{$file}";
  
  if (file_exists($filepath)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.basename($filepath));
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filepath));
    ob_clean();
    flush();
    readfile($filepath);
    exit;
  } 
?>