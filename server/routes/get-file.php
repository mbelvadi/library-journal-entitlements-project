<?php
  require('../util/error-handling.php');
	set_error_handler('apiErrorHandler', E_ALL);
  
  $url = 
  'https://www.crkn-rcdr.ca/sites/crkn/files/2022-01/CRKN_PARightsTracking_ACS_2021_12_07_01_0.xlsx';


  $ch = curl_init($url);
  $dir = '../PAR-files/';
  $file_name = basename($url);
  $save_file_loc = $dir . $file_name;

  $fp = fopen($save_file_loc, 'wb');
  
  curl_setopt($ch, CURLOPT_FILE, $fp);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_exec($ch);
  curl_close($ch);

  fclose($fp);
?>