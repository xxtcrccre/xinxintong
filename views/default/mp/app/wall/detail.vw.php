<?php
include_once dirname(dirname(dirname(__FILE__))).'/inmp.vw.php';

$view['params']['menu'] = '/rest/mp/app';
$view['params']['layout-body'] = '/mp/app/wall/detail';
$view['params']['angular-modules'] = "'matters.xxt','ui.bootstrap'";
$view['params']['global_js'] = array('matters-xxt');
$view['params']['css'] = array(array('/mp/app/wall', 'detail'));
$view['params']['js'] = array(array('/mp/app/wall', 'detail'));
