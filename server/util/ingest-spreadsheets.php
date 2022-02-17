<?php
  require '../vendor/autoload.php';
  use PhpOffice\PhpSpreadsheet\Spreadsheet;
  use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

  $config = json_decode(file_get_contents("../config.json"));

  $inputFileName = "../PAR-files/CRKN_PARightsTracking_ACS_2021_12_07_01_0.xlsx";
  $inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify($inputFileName);
  $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
  $spreadsheet = $reader->load($inputFileName);

  $dbProperties = (object) array(
    'title' => '',
    'title_id' => '',
    'print_issn' => '',
    'online_issn' => '',
    'former_title' => '',
    'succeeding_title' => '',
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

  class OpenDB extends SQLite3 {
    function __construct() {
      $this->open('../database/ljp.db');
    }
  }

  $db = new OpenDB();

  // Rights will ALWAYS start on row 4
  for ($i = 4; $i <= count($paRightSheetData); $i++) {
    $sqlStatement = $db->prepare("INSERT OR REPLACE INTO PA_RIGHTS (title, 
    title_id, print_issn, online_issn, former_title, succeeding_title, 
    agreement_code, year, collection_name, title_metadata_last_modified,
    filename, has_rights) VALUES (:title, :title_id, :print_issn, :online_issn, 
    :former_title, :succeeding_title, :agreement_code, :year, :collection_name, :title_metadata_last_modified, 
    :filename, :has_rights)");

    $sqlStatement->bindParam(':title', $paRightSheetData[$i][$dbProperties->title]);
    $sqlStatement->bindParam(':title_id', $paRightSheetData[$i][$dbProperties->title_id]);
    $sqlStatement->bindParam(':print_issn', $paRightSheetData[$i][$dbProperties->print_issn]);
    $sqlStatement->bindParam(':online_issn', $paRightSheetData[$i][$dbProperties->online_issn]);
    $sqlStatement->bindParam(':former_title', $paRightSheetData[$i][$dbProperties->former_title]);
    $sqlStatement->bindParam(':succeeding_title', $paRightSheetData[$i][$dbProperties->succeeding_title]);
    $sqlStatement->bindParam(':agreement_code', $paRightSheetData[$i][$dbProperties->agreement_code]);
    $sqlStatement->bindParam(':year', $paRightSheetData[$i][$dbProperties->year]);
    $sqlStatement->bindParam(':collection_name', $paRightSheetData[$i][$dbProperties->collection_name]);
    $sqlStatement->bindParam(':title_metadata_last_modified', $paRightSheetData[$i][$dbProperties->title_metadata_last_modified]);
    $sqlStatement->bindParam(':filename', $inputFileName);
    $sqlStatement->bindParam(':has_rights', $paRightSheetData[$i][$dbProperties->has_rights]);

    $sqlStatement->execute();
  }
  $db->close();

  print "\nSuccessfully inserted $inputFileName data into database.\n"

?>