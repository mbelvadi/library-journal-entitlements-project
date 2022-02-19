<?php
	require('../util/error-handling.php');
	set_error_handler('apiErrorHandler', E_ALL);

	$response = array("success" => true, "randomNumber" => rand(0, 100));

	echo json_encode($response)
?>