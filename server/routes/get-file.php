<?php
  // Initialize a file URL to the variable
  $url = 
  'https://www.crkn-rcdr.ca/sites/crkn/files/2022-01/CRKN_PARightsTracking_ACS_2021_12_07_01_0.xlsx';

  // Initialize the cURL session
  $ch = curl_init($url);

  // Initialize directory name where
  // file will be save
  $dir = '../PAR-files/';

  // Use basename() function to return
  // the base name of file
  $file_name = basename($url);

  // Save file into file location
  $save_file_loc = $dir . $file_name;

  // Open file
  $fp = fopen($save_file_loc, 'wb');

  // It set an option for a cURL transfer
  curl_setopt($ch, CURLOPT_FILE, $fp);
  curl_setopt($ch, CURLOPT_HEADER, 0);

  // Perform a cURL session
  curl_exec($ch);

  // Closes a cURL session and frees all resources
  curl_close($ch);

  // Close file
  fclose($fp);

?>