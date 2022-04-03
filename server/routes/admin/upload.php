<?php
  require '../../vendor/autoload.php';
  use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;

  require('../../database/util/ingest-spreadsheets.php');
  require('../../database/util/delete-crkn-data.php');
  require('../../util/error-handling.php');
  require('../../util/index.php');
  set_error_handler('apiErrorHandler', E_ALL);

  if(!isset($_POST["adminKey"])) {
    http_response_code(401);
    echo json_encode(array("error" => "admin key is required."));
    return;
  }

  $isValidAdmin = validAdmin($_POST["adminKey"], '../../database/admin.db');
  if(!$isValidAdmin) return;

  $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));

  $dbProperties = (object) array(
    'title' => false,
    'title_id' => false,
    'print_issn' => false,
    'online_issn' => false,
    'has_former_title' => false,
    'has_succeeding_title' => false,
    'agreement_code' => false,
    'year' => false,
    'collection_name' => false,
    'title_metadata_last_modified' => false,
    'has_rights' => false,
  );

  $newFilePath = "../../PAR-files/{$_FILES["file"]["name"]}";
  move_file($_FILES["file"]["tmp_name"], $newFilePath);

  $reader = ReaderEntityFactory::createReaderFromFile($newFilePath);
  $reader->setShouldPreserveEmptyRows(true);
  $reader->open($newFilePath);

  $hasPaRightsSheet = false;
  foreach ($reader->getSheetIterator() as $sheet) {
    $sheetName = $sheet->getName();
    if (!(strtolower($sheetName) === 'pa-rights')) continue;

    $hasPaRightsSheet = true;
    foreach ($sheet->getRowIterator() as $rowIndex => $row) {
      if ($rowIndex == 1) {
        $cells = $row->getCells();
        $packageName = '';
        foreach($cells as $key => $value){
          if ($key == 0) {
            $packageName = $value;
          }
          break;
        }
        if ($packageName == '') {
          $reader->close();
          http_response_code(400);
          unlink($newFilePath);
          echo json_encode(array("error" => "Please ensure there is a package name is cell A1."));
          return;
        }
      }
      elseif ($rowIndex > 3) break;
      elseif ($rowIndex !== 3 ) continue;
      $cells = $row->getCells();

      foreach($cells as $key => $value){
        if ($value->isEmpty()) continue;
        $cellValue = $value->getValue();
        if (strcmp($cellValue, $config->school) === 0) {
          $dbProperties->has_rights = true;
        }
        elseif (property_exists($dbProperties, strtolower($cellValue))) {
          $dbProperties->{strtolower($cellValue)} = true;
        }
      }
    }
    break;
  }

  $reader->close();

  if (!$hasPaRightsSheet) {
    http_response_code(400);
    unlink($newFilePath);
    echo json_encode(array("error" => "Please ensure the file has a sheet named 'PA-rights'"));
    return;
  }

  $school = $config->school;
  foreach ($dbProperties  as $key => $value) {
    if(!$value) {
      http_response_code(400);
      unlink($newFilePath);
      if ($key === 'has_rights') {
        echo json_encode(array("error" => "Please ensure the column '${school}' is present in row 3."));
        return;
      } else {
        echo json_encode(array("error" => "Please ensure the column '${key}' is present in row 3."));
        return;
      }
    }
  }

  if (isDatabaseLocked()) {
    unlink($newFilePath);
    http_response_code(503);
    echo json_encode(array("error" => "Database is locked by another process. Please try again later. Note if you think the database is incorrectly locked then it will automatically unlock in 2 hours."));
    return;
  }
  lockDatabase();
  ingestSpreadsheet($newFilePath, basename($newFilePath), 0);

  unlockDatabase();
  $serverFiles = getXLSXFiles('../../PAR-files/');
  echo json_encode(array("files" => $serverFiles));
?>
