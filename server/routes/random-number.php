<?php
	$response = array("success" => true, "randomNumber" => rand(0, 100));

	echo json_encode($response)
?>