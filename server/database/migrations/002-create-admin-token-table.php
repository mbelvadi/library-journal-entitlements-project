<?php
  function createAdminTokenTable($db) {
    $sql =<<<EOF
      CREATE TABLE IF NOT EXISTS ADMIN_TOKENS
      (token VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT (strftime('%s', 'now')),
      valid_till DATETIME NOT NULL DEFAULT (strftime('%s', 'now', '+8 hours')));
    EOF;

    $ret = $db->exec($sql);
    if(!$ret){
        echo $db->lastErrorMsg();
    }
    $db->close();
  }

  function runMigration() {
    createAdminTokenTable(new SQLite3('../admin.db'));
  }
  runMigration();
?>
