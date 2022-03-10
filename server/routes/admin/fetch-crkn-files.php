<?php
  require('../../database/util/ingest-spreadsheets.php');
  require('../../database/util/delete-crkn-data.php');
  require('../../util/error-handling.php');
  require '../../vendor/autoload.php';
  require('../../util/index.php');

  use simplehtmldom\HtmlWeb;
	set_error_handler('apiErrorHandler', E_ALL);

  if(!isset($_GET["adminKey"])) {
    http_response_code(401);
    echo json_encode(array("error" => "admin key is required."));
    return;
  }

  $isValidAdmin = validAdmin($_GET["adminKey"], '../../database/ljp.db');
  if(!$isValidAdmin) return;

  // 1. Fetch new files from CRKN site and put them in temp directory
  $crkn_website_url = 'https://www.crkn-rcdr.ca';
  $crkn_files_page_path = '/en/perpetual-access-rights-reports-storage';

  $client = new HtmlWeb();
  $html = $client->load("{$crkn_website_url}{$crkn_files_page_path}");
  $links = $html->find('a[title*=CRKN_PARightsTracking]');

  foreach($links as $link) {
    $url = "{$crkn_website_url}{$link->href}";

    $ch = curl_init($url);
    $dir = './';
    $file_name = basename($url);
    $save_file_loc = $dir . $file_name;

    $fp = fopen($save_file_loc, 'wb');
    
    curl_setopt($ch, CURLOPT_FILE, $fp);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_exec($ch);
    curl_close($ch);

    fclose($fp);
  }

  $crknFilesPath = dirname(__DIR__, 2) . '/PAR-files/CRKN_PARightsTracking_*.xlsx';
  // 2. Get List of CRKN files in PAR-files directory & delete them
  $oldCrknFiles = glob($crknFilesPath);
  foreach($oldCrknFiles as $file) {
    if(is_file($file)) {
      unlink($file);
    }
  }

  // 3. Move new files to proper folder
  function move_file($path,$to){
    if(copy($path, $to)){
       unlink($path);
       return true;
    } else {
      return false;
    }
  }

  $newCrknFiles = glob("./CRKN_PARightsTracking_*.xlsx");
  foreach($newCrknFiles as $file) {
    $fileBaseName = basename($file);
    move_file($file, "../../PAR-files/{$fileBaseName}"); // TODO handle error if file fails to move
  }

  // 4. Ingest new data into DB
  ini_set('memory_limit', '1G');
  $crknFiles = glob($crknFilesPath);
  $uploadStartTime = time();
  foreach($crknFiles as $file) {
    ingestSpreadsheet($file, basename($file), true);
  }

  // 5. Remove old DB entries
  deleteOldCrknData('time', $uploadStartTime, null);

  echo json_encode(array("message" => "Successfully updated crkn files."));
?>