<?php
  function validAdmin ($adminKey, $dbRoute) {
    $db = new SQLite3($dbRoute);
    $sqlStatement = $db->prepare("SELECT * FROM ADMIN_TOKENS WHERE token = :adminKey AND valid_till >= strftime('%s', 'now')");
    $sqlStatement->bindParam(':adminKey', $adminKey);
    $results = $sqlStatement->execute();
    $resultsArray = array();
    while ($res= $results->fetchArray(1)) {
      array_push($resultsArray, $res);
    }
    $db->close();
  
    if(count($resultsArray) !== 1) {
      http_response_code(401);
      echo json_encode(array("error" => "invalid admin key. Please login again."));
      return false;
    }
    return true;
  }

  function getXLSXFiles($path) {
    if (is_dir($path)) {
        $res = array();
        foreach (array_filter(glob($path ."*.xlsx"), 'is_file') as $file) {
            array_push($res, str_replace($path, "", $file));                
        }
        return $res;
    }
    return false;
  }

  function move_file($path,$to){
    if(copy($path, $to)){
       unlink($path);
       return true;
    } else {
      return false;
    }
  }
?>