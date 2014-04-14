<?php
header("Content-Type: application/json");
$response['request'] = $_REQUEST;
$response["files"] = $_FILES;

if(empty($_FILES) && !$_REQUEST['size']) {
	header("Request Entity Too Large", true, 413);
	$response['fail'] = "See maxbytes for maximum upload size";
	$response['maxbytes'] = ini_get('post_max_size') * 1024 * 1024;
} else {
	$response["filename"] = $_FILES['file']['tmp_name'];
	$response["md5"] =  md5_file( $_FILES['file']['tmp_name'] );
}

echo json_encode($response);
?>
