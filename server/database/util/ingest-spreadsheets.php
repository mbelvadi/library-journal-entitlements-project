<?php
  require '../../vendor/autoload.php';
  use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;

  function ingestSpreadsheet($filePath, $filename, $isCrknFile = false) {
    $config = json_decode(file_get_contents(dirname(__DIR__, 2) . '/config.json'));

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

    $dbPath = dirname(__DIR__, 1) . '/ljp.db';
    $db = new SQLite3($dbPath);

    $reader = ReaderEntityFactory::createReaderFromFile($filePath);
    $reader->setShouldPreserveEmptyRows(true);
    $reader->open($filePath);
    
    foreach ($reader->getSheetIterator() as $sheet) {
      $sheetName = $sheet->getName();
      if (!(strtolower($sheetName) === 'pa-rights')) continue;

      foreach ($sheet->getRowIterator() as $rowIndex => $row) {
        if ($rowIndex < 3) {
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
            continue;
          }

          if ($cells[$dbProperties->title]->isEmpty() || $cells[$dbProperties->year]->isEmpty() || $cells[$dbProperties->has_rights]->isEmpty() ) {
            continue;
          }

          if ($cells[$dbProperties->has_rights] != 'Y' &&
            $cells[$dbProperties->has_rights] != 'YBUT' &&
            $cells[$dbProperties->has_rights] != 'NBUT' &&
            $cells[$dbProperties->has_rights] != 'N'
          ) continue;

          $yearInt = (int) $cells[$dbProperties->year]->getValue();
          if ($yearInt < 1900 || $yearInt > 2100) {
            continue;
          }
      
          $sqlStatement = $db->prepare("INSERT OR REPLACE INTO PA_RIGHTS (title, 
          title_id, print_issn, online_issn, has_former_title, has_succeeding_title, 
          agreement_code, year, collection_name, title_metadata_last_modified,
          filename, has_rights, is_crkn_record) VALUES (:title, :title_id, :print_issn, :online_issn, 
          :has_former_title, :has_succeeding_title, :agreement_code, :year, :collection_name, :title_metadata_last_modified, 
          :filename, :has_rights, :is_crkn_record)");
    
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
          
          if (is_a($lastModified, 'DateTime') || (is_string($lastModified) && strtotime($lastModified))){
            $lastModified = $lastModified->format('d/m/Y');
          } else {
            $lastModified = '';
          }

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
    
          $sqlStatement->execute();
        }
      }
      break;
    }
    
    $reader->close(); 
    $db->close();
  }
?>