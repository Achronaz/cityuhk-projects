<?php 
if(
  (!isset($_GET['houseid']) ||
  !isset($_GET['clientname']) || 
  !isset($_GET['clientemail'])) && 
  (isset($_GET['seats']) xor isset($_GET['qty']))
){
    echo json_encode(array('code'=>300, 'msg'=>'missing houseid, clientname, clientemail or seats.'));
    exit;
}
include 'conn.php';
$houseid = $_GET['houseid'];
$clientname = $_GET['clientname'];
$clientemail = $_GET['clientemail'];
$clientid = -1;
//check client is exist;
$sql = "SELECT * FROM client WHERE client_email = :clientemail";
$stid = oci_parse($conn, $sql);
oci_bind_by_name($stid, ':clientemail', $clientemail);
$r = oci_execute($stid);
$row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS);
//client not exist
if(!$row){
    //insert client
    $sql = "INSERT INTO client VALUES((SELECT COALESCE(MAX(client_id),0) FROM client)+1, :clientemail, :clientname)";
    $stid = oci_parse($conn, $sql);
    oci_bind_by_name($stid, ':clientemail', $clientemail);
    oci_bind_by_name($stid, ':clientname', $clientname);
    $r = oci_execute($stid);
    //select client
    $sql = "SELECT * FROM client WHERE client_email = :clientemail";
    $stid = oci_parse($conn, $sql);
    oci_bind_by_name($stid, ':clientemail', $clientemail);
    $r = oci_execute($stid);
    $row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS);
    $clientid = $row['CLIENT_ID'];
} else { 
    $clientid = $row['CLIENT_ID'];
}
//client exist now
if(isset($_GET['seats'])) {
  //order buy entering seats
  $seats = $_GET['seats'];
  $seatsArr = explode(',',$seats);
  foreach ($seatsArr as $seat) {
    $sql = "INSERT INTO ticket VALUES((SELECT COALESCE(MAX(ticket_id),0) FROM ticket)+1, :clientid, :houseid, :seatno)";
    $stid = oci_parse($conn, $sql);
    oci_bind_by_name($stid, ':clientid', $clientid);
    oci_bind_by_name($stid, ':houseid', $houseid);
    oci_bind_by_name($stid, ':seatno', $seat);
    $r = oci_execute($stid);
  }
  echo json_encode(array('code'=>100, 'msg'=>'all ticket order are accepted.'));
  
} else if(isset($_GET['qty'])) {
  //order buy entering number of seat
  $qty = $_GET['qty'];
  if($qty > 10){
      echo json_encode(array('code'=>200, 'msg'=>'No consecutive seats are more than 10.'));
  }else{
    $ROWS = array('A','B','C','D','E');
    $COLS = array(0,1,2,3,4,5,6,7,8,9);
    $SEATSARR = array();
    for($r=0; $r < sizeof($ROWS); $r++){
        $rowtemp = array();
        for($c=0; $c < sizeof($COLS); $c++){
            $k = $ROWS[$r].$COLS[$c];
            $SEATSARR[$k] = 0;
        }
    }
    
    $sql = "SELECT * FROM ticket WHERE house_id = :houseid";
    $stid = oci_parse($conn, $sql);
    oci_bind_by_name($stid, ':houseid', $houseid);
    $r = oci_execute($stid);
    while($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)){
        $SEATSARR[$row['SEAT_NO']] = 2;
    }
    
    $ARRAY = array_chunk($SEATSARR,10);
    $need = $qty;
    //$found = false;
    $resultArr = array();
    for($r=0;$r <= 5; $r++){
      for($c=0;$c <= 9; $c++){
        $seat = $ROWS[$r].$c;
          array_push($resultArr, $seat);
        if($ARRAY[$r][$c] == 2) $resultArr = array();
        if(sizeof($resultArr) == $need){
          //$found = true;
          break 2;
        }
        if($c == 9) $resultArr = array();
      }
    }
    
    //if($found){
      foreach ($resultArr as $seat) {
        $sql = "INSERT INTO ticket VALUES((SELECT COALESCE(MAX(ticket_id),0) FROM ticket)+1, :clientid, :houseid, :seatno)";
        $stid = oci_parse($conn, $sql);
        oci_bind_by_name($stid, ':clientid', $clientid);
        oci_bind_by_name($stid, ':houseid', $houseid);
        oci_bind_by_name($stid, ':seatno', $seat);
        $r = oci_execute($stid);
        if (!$r) {
            echo json_encode(array('code'=>200, 'msg'=>'No '. $qty .' consecutive seats available'));
            exit;
        }
      }
      echo json_encode(array('code'=>100, 'msg'=>'success','added'=>$resultArr));
      
    //} else {
    //  echo json_encode(array('code'=>200, 'msg'=>'No '. $qty .' consecutive seats available'));
    //}
    
  }
}
  
oci_free_statement($stid);
oci_close($conn);
?>