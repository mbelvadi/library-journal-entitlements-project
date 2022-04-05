<?php
  require '../../vendor/autoload.php';
  use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;

  function ingestSpreadsheet($filePath, $filename, $isCrknFile = false) {
    $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));
    $errorFile = fopen(dirname(__DIR__, 2) . '/upload-errors.csv', 'a');


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

    $dbPath = dirname(__DIR__, 1) . '/ljep.db';
    $db = new SQLite3($dbPath);
    $db->busyTimeout(10000);

    $reader = ReaderEntityFactory::createReaderFromFile($filePath);
    $reader->setShouldPreserveEmptyRows(true);
    $reader->open($filePath);

    $packageName = '';
    foreach ($reader->getSheetIterator() as $sheet) {
      $sheetName = $sheet->getName();
      if (!(strtolower($sheetName) === 'pa-rights')) continue;

      foreach ($sheet->getRowIterator() as $rowIndex => $row) {
        if ($rowIndex == 1) {
          $cells = $row->getCells();
          foreach($cells as $key => $value){
            if ($key == 0) {
              $packageName = $value;
            }
            break;
          }
        } elseif ($rowIndex < 3) {
          continue;
        } elseif ($rowIndex === 3) {
          $cells = $row->getCells();

          foreach($cells as $key => $value){
            if ($value->isEmpty()) continue;
            $cellValue = $value->getValue();
            if (strcmp($cellValue, $config->school) === 0) {
              $dbProperties->has_rights = $key;
            }
            elseif (property_exists($dbProperties, strtolower($cellValue))) {
              $dbProperties->{strtolower($cellValue)} = $key;
            }
          }
        } else {
          $cells = $row->getCells();
          if(!array_key_exists($dbProperties->title, $cells) || !array_key_exists($dbProperties->year, $cells) || !array_key_exists($dbProperties->has_rights, $cells)) {
            fwrite($errorFile, "{$filename},{$rowIndex},missing title and/or year and/or rights\n");
            continue;
          }

          if ($cells[$dbProperties->title]->isEmpty() || $cells[$dbProperties->year]->isEmpty() || $cells[$dbProperties->has_rights]->isEmpty() ) {
            fwrite($errorFile, "{$filename},{$rowIndex},missing title and/or year and/or rights\n");
            continue;
          }

          if ($cells[$dbProperties->has_rights] != 'Y' &&
            $cells[$dbProperties->has_rights] != 'YBut' &&
            $cells[$dbProperties->has_rights] != 'NBut' &&
            $cells[$dbProperties->has_rights] != 'N'
          ) {
            fwrite($errorFile, "{$filename},{$rowIndex},invalid rights value\n");
            continue;
          }

          $yearInt = (int) $cells[$dbProperties->year]->getValue();
          if ($yearInt < 1900 || $yearInt > 2100) {
            fwrite($errorFile, "{$filename},{$rowIndex},invalid year\n");
            continue;
          }

          $sqlStatement = $db->prepare("INSERT OR IGNORE INTO PA_RIGHTS (id, title, title_id, print_issn, online_issn, has_former_title, has_succeeding_title,
          agreement_code, year, collection_name, title_metadata_last_modified,
          filename, has_rights, package_name, is_crkn_record) VALUES (:id, :title, :title_id, :print_issn, :online_issn,
          :has_former_title, :has_succeeding_title, :agreement_code, :year, :collection_name, :title_metadata_last_modified,
          :filename, :has_rights, :package_name, :is_crkn_record)");

          $title = $cells[$dbProperties->title]->getValue();
          $titleId = array_key_exists($dbProperties->title_id, $cells) ? $cells[$dbProperties->title_id]->getValue() : '';
          $printISSN = array_key_exists($dbProperties->print_issn, $cells) ? $cells[$dbProperties->print_issn]->getValue() : '';
          $onlineISSN = array_key_exists($dbProperties->online_issn, $cells) ? $cells[$dbProperties->online_issn]->getValue() : '';
          $hasFormerTitle = array_key_exists($dbProperties->has_former_title, $cells) ? $cells[$dbProperties->has_former_title]->getValue() : '';
          $hasSucceedingTitle = array_key_exists($dbProperties->has_succeeding_title, $cells) ? $cells[$dbProperties->has_succeeding_title]->getValue() : '';
          $agreementCode = array_key_exists($dbProperties->agreement_code, $cells) ? $cells[$dbProperties->agreement_code]->getValue() : '';
          $year = $cells[$dbProperties->year]->__toString();
          $collectionName = array_key_exists($dbProperties->collection_name, $cells) ? $cells[$dbProperties->collection_name]->getValue() : '';
          $lastModified = array_key_exists($dbProperties->title_metadata_last_modified, $cells) ? $cells[$dbProperties->title_metadata_last_modified]->getValue() : '';
          $hasRights = $cells[$dbProperties->has_rights]->getValue();

          if (is_a($lastModified, 'DateTime')){
            $lastModified = $lastModified->format('d/m/Y');
          } else {
            $lastModified = '';
          }

          $hashedId = hash('md5', "{$title}{$packageName}{$year}");
          $sqlStatement->bindParam(':id', $hashedId);
          $sqlStatement->bindParam(':title', $title);
          $sqlStatement->bindParam(':title_id', $titleId);
          $sqlStatement->bindParam(':print_issn', $printISSN);
          $sqlStatement->bindParam(':online_issn', $onlineISSN);
          $sqlStatement->bindParam(':has_former_title', $hasFormerTitle);
          $sqlStatement->bindParam(':has_succeeding_title', $hasSucceedingTitle);
          $sqlStatement->bindParam(':agreement_code', $agreementCode);
          $sqlStatement->bindParam(':year', $year);
          $sqlStatement->bindParam(':collection_name', $collectionName);
          $sqlStatement->bindParam(':title_metadata_last_modified', $lastModified);
          $sqlStatement->bindParam(':filename', $filename);
          $sqlStatement->bindParam(':has_rights', $hasRights);
          $sqlStatement->bindParam(':is_crkn_record', $isCrknFile);
          $sqlStatement->bindParam(':package_name', $packageName);

          $sqlStatement->execute();
        }
      }
      break;
    }

    fclose($errorFile);
    $reader->close();
    $db->close();
  }
?>
