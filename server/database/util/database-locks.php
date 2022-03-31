<?php
  function lockDatabase() {
    $dbPath = dirname(__DIR__, 1) . '/lock.db';
    $db = new SQLite3($dbPath);
    $lockTocken = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));

    $sqlStatement = $db->prepare("INSERT INTO DATABASE_LOCKED (token) VALUES (:token)");
    $sqlStatement->bindParam(':token', $lockTocken);
    $sqlStatement->execute();

    $db->close();
    return $lockTocken;
  }

  function unlockDatabase() {
    $dbPath = dirname(__DIR__, 1) . '/lock.db';
    $db = new SQLite3($dbPath);
    $sqlStatement = $db->prepare("DELETE FROM DATABASE_LOCKED");
    $sqlStatement->execute();
    $db->close();
  }

  function isDatabaseLocked() {
    $dbPath = dirname(__DIR__, 1) . '/lock.db';
    $db = new SQLite3($dbPath);

    $results = $db->query("SELECT * FROM DATABASE_LOCKED WHERE expires_at >= strftime('%s', 'now')");
    $resultsArray = array();
    while ($res = $results->fetchArray(1)) {
      array_push($resultsArray, $res);
    }
    $db->close();
  
    return count($resultsArray) !== 0;
  }
?>