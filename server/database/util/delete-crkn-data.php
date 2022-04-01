<?php
  function deleteOldCrknData($mode, $time, $filename) {
    $dbPath = dirname(__DIR__, 1) . '/ljep.db';
    $db = new SQLite3($dbPath);

    if ($mode === 'time') {
      $sqlStatement = $db->prepare("DELETE FROM PA_RIGHTS WHERE created_at < :time_cutoff AND is_crkn_record = true");
      $sqlStatement->bindParam(':time_cutoff', $time);
      $sqlStatement->execute();
    } else if ($mode === 'filename') {
      $sqlStatement = $db->prepare("DELETE FROM PA_RIGHTS WHERE created_at < :time_cutoff AND filename = :filename");
      $sqlStatement->bindParam(':time_cutoff', $time);
      $sqlStatement->bindParam(':filename', $filename);
      $sqlStatement->execute();
    }


    $db->close();
  }
?>
