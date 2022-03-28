<?php
  function wipeDatabase() {
    $dbPath = dirname(__DIR__, 1) . '/ljp.db';
    $db = new SQLite3($dbPath);
    $sqlStatement = $db->prepare("DELETE FROM PA_RIGHTS");
    $sqlStatement->execute();
    $db->close();
  }
?>