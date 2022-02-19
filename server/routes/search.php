<?php
  require('../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);

  $DEFAULT_PAGE_LENGTH = -1; // CLient doesn't want pagination

  $data = json_decode(file_get_contents("php://input"));
  $page = (property_exists($data, "page")) ? $data->page : 1;
  $pageLength = (property_exists($data, "pageLength")) ? $data->pageLength: $DEFAULT_PAGE_LENGTH;

  $db = new SQLite3('../database/ljp.db');

  $filterSQL = '';
  if (isset($data->startYear)) {
    $filterSQL .= "AND year >= $data->startYear";
    if(isset($data->endYear)) {
      $filterSQL .= " AND year <= $data->endYear";
    }
  } elseif (isset($data->endYear)) {
    $filterSQL .= "AND year <= $data->endYear";
  } elseif (isset($data->year)) {
    $filterSQL .= "AND year = $data->year";
  }

  $results = $db->query("SELECT * from PA_RIGHTS WHERE (title LIKE '%$data->query%' OR print_issn LIKE '%$data->query%' OR online_issn LIKE '%$data->query%') $filterSQL");
  $resultsArray = array();
  while ($res= $results->fetchArray(1)) {
    array_push($resultsArray, $res);
  }
  $db->close();

  http_response_code(200);
  echo json_encode(array("results" => $resultsArray, "query" => $data->query, "numResults" => count($resultsArray), "pagination" => array("currentPage" => $page, "totalPages" => 1) ));
?>