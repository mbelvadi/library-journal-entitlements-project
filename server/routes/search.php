<?php
  require('../util/error-handling.php');
  set_error_handler('apiErrorHandler', E_ALL);

  $DEFAULT_PAGE_LENGTH = -1; // CLient doesn't want pagination

  $data = json_decode(file_get_contents("php://input"));
  if (!$data || !property_exists($data, "query")) {
    http_response_code(400);
    echo json_encode(array("error" => "query must be specified"));
    return;
  }

  $page = (property_exists($data, "page")) ? $data->page : 1;
  $pageLength = (property_exists($data, "pageLength")) ? $data->pageLength: $DEFAULT_PAGE_LENGTH;

  $db = new SQLite3('../database/ljep.db');

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

  $config = json_decode(file_get_contents(dirname(__DIR__, 1) . '/config.json'));

  $rightsFilterQuery = $config->includeNoRightsInSearchResults ? "" : "AND (has_rights = 'Y' OR has_rights = 'YBut')";

  $sqlStatement = $db->prepare("SELECT * from PA_RIGHTS WHERE (title LIKE :cleanedQuery OR print_issn LIKE :cleanedQuery OR online_issn LIKE :cleanedQuery) $rightsFilterQuery $filterSQL ORDER BY CASE has_rights WHEN 'Y' THEN 0 WHEN 'YBut' THEN 1 WHEN 'NBut' THEN 2 WHEN 'N' THEN 3 END, title, year DESC");
  $cleanedQuery = str_replace("'", "''", $data->query);
  $cleanedSQLQuery = "%$cleanedQuery%";
  $sqlStatement->bindParam(':cleanedQuery', $cleanedSQLQuery);
  $results = $sqlStatement->execute();
  $resultsArray = array();
  while ($res= $results->fetchArray(1)) {
    array_push($resultsArray, $res);
  }
  $db->close();

  http_response_code(200);
  echo json_encode(array("results" => $resultsArray, "query" => $data->query, "numResults" => count($resultsArray), "pagination" => array("currentPage" => $page, "totalPages" => 1) ));
?>
