<?php
  function deleteOldCrknData($time) {
    $dbPath = dirname(__DIR__, 1) . '/ljp.db';
    $db = new SQLite3($dbPath);

    $sqlStatement = $db->prepare("DELETE FROM PA_RIGHTS WHERE created_at < :time_cutoff AND is_crkn_record = true");

    $sqlStatement->bindParam(':time_cutoff', $time);

    $sqlStatement->execute();

    $db->close();
  }
?>