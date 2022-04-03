<?php
  function deleteSpreadsheetData($filename) {
    $dbPath = dirname(__DIR__, 1) . '/ljep.db';
    $db = new SQLite3($dbPath);
    
    $sqlStatement = $db->prepare("DELETE FROM PA_RIGHTS WHERE filename = :filename");
    $sqlStatement->bindParam(':filename', $filename);
    $sqlStatement->execute();

    $db->close();
  }
?>
