<?php
require_once dirname(__FILE__).'/matter_ctrl.php';

class activitysignin extends mp_controller {

    public function get_access_rule()
    {
        $rule_action['rule_type'] = 'white';
        $rule_action['actions'][] = 'hello';
        return $rule_action;
    }
    /**
     *
     */
    public function index_action() 
    {
        $q = array(
            'aid id,title', 
            'xxt_activity',
            "mpid='$this->mpid'"
        );
        $q2 = array('o'=>'create_at desc');

        $acts = $this->model()->query_objs_ss($q);

        return new ResponseData($acts);
    }
}
