<?php
  require '../../vendor/autoload.php';
  use PhpOffice\PhpSpreadsheet\Spreadsheet;
  use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

  function ingestSpreadsheet($filePath, $filename, $isCrknFile = false) {
    $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));
    $fileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify($filePath);
    $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($fileType);
    $spreadsheet = $reader->load($filePath);

    $dbProperties = (object) array(
      'title' => '',
      'title_id' => '',
      'print_issn' => '',
      'online_issn' => '',
      'has_former_title' => '',
      'has_succeeding_title' => '',
      'agreement_code' => '',
      'year' => '',
      'collection_name' => '',
      'title_metadata_last_modified' => '',
      'has_rights' => '',
    );

    $sheetNames = $spreadsheet->getSheetNames();
    $paRightSheet = $spreadsheet->getSheetByName('PA-rights'); // sheet we are concerned with will ALWAYS be called 'PA-rights'
    $paRightSheetData = $paRightSheet->toArray(null, true, true, true);

    // 3rd Row of PA-rights sheet will ALWAYS contain headers
    foreach($paRightSheetData[3] as $key => $value){
      if (strcmp($value, $config->school) === 0) {
        $dbProperties->has_rights = $key;
      }
      elseif (property_exists($dbProperties, strtolower($value))) {
        $dbProperties->{strtolower($value)} = $key;
      }
    }

    $dbPath = dirname(__DIR__, 1) . '/ljp.db';
    $db = new SQLite3($dbPath);

    for ($i = 4; $i <= count($paRightSheetData); $i++) { // Rights will ALWAYS start on row 4
      $row = $paRightSheetData[$i];
      if (!isset($row[$dbProperties->title]) || !isset($row[$dbProperties->title_id]) || !isset($row[$dbProperties->agreement_code]) || !isset($row[$dbProperties->year]) || !isset($row[$dbProperties->has_rights])) {
        continue;
      }

      $sqlStatement = $db->prepare("INSERT OR REPLACE INTO PA_RIGHTS (title, 
      title_id, print_issn, online_issn, has_former_title, has_succeeding_title, 
      agreement_code, year, collection_name, title_metadata_last_modified,
      filename, has_rights, is_crkn_record) VALUES (:title, :title_id, :print_issn, :online_issn, 
      :has_former_title, :has_succeeding_title, :agreement_code, :year, :collection_name, :title_metadata_last_modified, 
      :filename, :has_rights, :is_crkn_record)");

      $sqlStatement->bindParam(':title', $row[$dbProperties->title]);
      $sqlStatement->bindParam(':title_id', $row[$dbProperties->title_id]);
      $sqlStatement->bindParam(':print_issn', $row[$dbProperties->print_issn]);
      $sqlStatement->bindParam(':online_issn', $row[$dbProperties->online_issn]);
      $sqlStatement->bindParam(':has_former_title', $row[$dbProperties->has_former_title]);
      $sqlStatement->bindParam(':has_succeeding_title', $row[$dbProperties->has_succeeding_title]);
      $sqlStatement->bindParam(':agreement_code', $row[$dbProperties->agreement_code]);
      $sqlStatement->bindParam(':year', $row[$dbProperties->year]);
      $sqlStatement->bindParam(':collection_name', $row[$dbProperties->collection_name]);
      $sqlStatement->bindParam(':title_metadata_last_modified', $row[$dbProperties->title_metadata_last_modified]);
      $sqlStatement->bindParam(':filename', $filename);
      $sqlStatement->bindParam(':has_rights', $row[$dbProperties->has_rights]);
      $sqlStatement->bindParam(':is_crkn_record', $isCrknFile);

      $sqlStatement->execute();
    }
    $db->close();
  }
?>