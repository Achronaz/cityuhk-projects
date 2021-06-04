<?php
$conn = oci_connect("kktsang27", "123741456852", "//ora11g.cs.cityu.edu.hk:1522/orcl.cs.cityu.edu.hk");
if (!$conn) {
   $m = oci_error();
   echo $m['message'], "\n";
   exit;
}
?>