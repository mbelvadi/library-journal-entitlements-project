<?php
  require('../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);
  
  function getXLSXFiles($path) {
    if (is_dir($path)) {
        $res = array();
        foreach (array_filter(glob($path ."*.xlsx"), 'is_file') as $file) {
            array_push($res, str_replace($path, "", $file));                
        }
        return $res;
    }
    return false;
  }

  $files = getXLSXFiles('../PAR-files/');
  echo json_encode($files);
?>