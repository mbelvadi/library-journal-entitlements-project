<?php
  function createDatabaseLockTable($db) {
    $sql =<<<EOF
      CREATE TABLE IF NOT EXISTS DATABASE_LOCKED
      (token VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT (strftime('%s', 'now')),
      expires_at DATETIME NOT NULL DEFAULT (strftime('%s', 'now', '+20 minutes')));
    EOF;

    $ret = $db->exec($sql);
    if(!$ret){
        echo $db->lastErrorMsg();
    } 
    $db->close();
  }

  function runMigration() {
    createDatabaseLockTable(new SQLite3('../lock.db'));
  }
  runMigration();
?>