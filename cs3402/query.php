<?php
if(!isset($_GET['houseid'])){
    echo json_encode(array('code'=>300, 'msg'=>'missing houseid.'));
    exit;
}
include 'conn.php';
$houseid = $_GET['houseid'];

$sql = "SELECT * FROM ticket  WHERE house_id = :houseid";

$stid = oci_parse($conn, $sql);
oci_bind_by_name($stid, ':houseid', $houseid);
if (!$stid) {
    $e = oci_error($conn);
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}
$r = oci_execute($stid);
if (!$r) {
    $e = oci_error($stid);
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}
$temp = array();
while($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)){
    array_push($temp,$row);
}

echo json_encode(array('code'=>100, 'msg'=>'success','data'=>$temp));
oci_free_statement($stid);
oci_close($conn);
?>