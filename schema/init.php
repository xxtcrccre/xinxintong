﻿<?php
/**
 * create all tables.
 */
include_once(dirname(__FILE__)).'/db_schema_account.php';
include_once(dirname(__FILE__)).'/db_schema_activity.php';
include_once(dirname(__FILE__)).'/db_schema_activity2.php';
include_once(dirname(__FILE__)).'/db_schema_addressbook.php';
include_once(dirname(__FILE__)).'/db_schema_bbs.php';
include_once(dirname(__FILE__)).'/db_schema_checkin.php';
include_once(dirname(__FILE__)).'/db_schema_code.php';
include_once(dirname(__FILE__)).'/db_schema_log.php';
include_once(dirname(__FILE__)).'/db_schema_lottery.php';
include_once(dirname(__FILE__)).'/db_schema_matter.php';
include_once(dirname(__FILE__)).'/db_schema_mpa.php';
include_once(dirname(__FILE__)).'/db_schema_reply.php';
include_once(dirname(__FILE__)).'/db_schema_tag.php';
include_once(dirname(__FILE__)).'/db_schema_user.php';
include_once(dirname(__FILE__)).'/db_schema_wall.php';
include_once(dirname(__FILE__)).'/db_schema_writer.php';
/**
 * init data.
 */
$sql = array();
// 用户组
$sql[] = "delete from account_group";
$sql[] = "INSERT INTO account_group(group_id,group_name,asdefault,p_mpgroup_create,p_mp_create,p_mp_permission) VALUES(1, '初级用户', 1, 0, 1, 0),(3, '开发用户', 0, 1, 1, 1)";
// xxt_inner
$sql[] = "delete from xxt_inner";
$sql[] = "INSERT INTO xxt_inner(id,title,name) VALUES(1,'通讯录','Addressbook')";
$sql[] = "INSERT INTO xxt_inner(id,title,name) VALUES(3, '翻译', 'Translate')";
$sql[] = "INSERT INTO xxt_inner(id,title,name) VALUES(4, '按关键字搜索文章', 'Fullsearch')";
$sql[] = "INSERT INTO xxt_inner(id,title,name) VALUES(6, '投稿箱', 'Contribute')";
$sql[] = "INSERT INTO xxt_inner(id,title,name) VALUES(7, '按编号搜索文章', 'Codesearch')";
$sql[] = "INSERT INTO xxt_inner(id,title,name) VALUES(8, '按编号搜索活动', 'Activitycodesearch')";
//$sql[] = "INSERT INTO xxt_inner(id,title,name) VALUES(9, '我发起的活动', 'Myactivites')";

// 执行
foreach ($sql as $s) {
    if (!mysql_query($s)) {
        header('HTTP/1.0 500 Internal Server Error');
        echo "database error: ".mysql_error();
    }
}
