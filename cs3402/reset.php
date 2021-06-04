<?php
include 'conn.php';
$sql = "DELETE FROM ticket";
$stid = oci_parse($conn, $sql);
oci_execute($stid);
$sql = "DELETE FROM client";
$stid = oci_parse($conn, $sql);
oci_execute($stid);
echo json_encode(array('code'=>100, 'msg'=>'deleted'));
oci_free_statement($stid);
oci_close($conn);
?>