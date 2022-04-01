<?php
  $config = json_decode(file_get_contents(dirname(__DIR__, 1) . '/config.json'));

  echo json_encode($config->style)
?>