<?php
require_once '../../db.php';

$sqls = array();
$sqls[] = "drop TABLE xxt_activity_enroll_receiver";
$sqls[] = "drop TABLE xxt_activity_cusdata";

foreach ($sqls as $sql) {
    if (!mysql_query($sql)) {
        header('HTTP/1.0 500 Internal Server Error');
        echo 'database error: '.mysql_error();
    }
}
echo "end update ".__FILE__.PHP_EOL;
