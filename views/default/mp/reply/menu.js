xxtApp.controller('MenuCtrl',['$rootScope','$scope','http2','matterTypes','$timeout',function($rootScope,$scope,http2,matterTypes,$timeout) {
    $scope.matterTypes = matterTypes;
    var setPublishState = function(state) {
        for (var i in $scope.menu) {
            $scope.menu[i].published = state;
            for (var j in $scope.menu[i].sub) {
                $scope.menu[i].sub[j].published = state;
            }
        }
        $scope.published = $scope.menu[0].published;
    };
    $scope.edit = function(button) {
        if (button.sub === undefined || button.sub.length === 0) {
            http2.get('/rest/mp/call/menu?k='+button.menu_key, function(rsp){
                $scope.editing = button;
                delete $scope.editing.matter;
                delete $scope.editing.acl;
                if (rsp.data.matter) {
                    var matter = rsp.data.matter;
                    if (/text/i.test(matter.type))
                        matter.title = matter.content;
                    $scope.editing.matter = matter;
                }
                if ($scope.editing.matter || $scope.editing.url) $scope.editing.hasReply = true;
                if (rsp.data.acl)
                    $scope.editing.acl = rsp.data.acl;
                $scope.persisted = angular.copy($scope.editing);
            });
        } else {
            $scope.editing = button;
            $scope.persisted = angular.copy($scope.editing);
        }
    };
    $scope.appendButton = function(evt) {
        var button = {menu_name:'新菜单'};
        http2.post('/rest/mp/call/menu/createButton', button, function(rsp){
            button = rsp.data;
            if (button.sub === undefined) button.sub = [];
            $scope.menu.push(button);
            setPublishState('N');
            $scope.edit(button);
        });
    };
    $scope.appendSubButton = function(button, afterIndex) {
        var buttonPos = $scope.menu.indexOf(button) + 1;
        var subButton = {menu_name:'新子菜单',l1_pos:buttonPos};
        if (afterIndex !== undefined) {
            subButton.l2_pos = afterIndex+2;
        }
        http2.post('/rest/mp/call/menu/createSubButton', subButton, function(rsp){
            subButton = rsp.data;
            if (button.sub === undefined)
                button.sub = [subButton];
            else {
                if (afterIndex === undefined)
                    button.sub.splice(0,0,subButton);
                else
                    button.sub.splice(afterIndex+1,0,subButton);
            }
            setPublishState('N');
            $scope.edit(subButton);
        });
    };
    $scope.removeButton = function(button, index, evt) {
        evt.preventDefault();
        evt.stopPropagation();
        http2.get('/rest/mp/call/menu/removeButton?k='+button.menu_key, function(rsp){
            $scope.menu.splice(index, 1);
            setPublishState('N');
            $scope.editing = false;
        });
    };
    $scope.removeSubButton = function(button, subButton, index, evt) {
        evt.preventDefault();
        evt.stopPropagation();
        http2.get('/rest/mp/call/menu/removeButton?k='+subButton.menu_key, function(rsp){
            button.sub.splice(index, 1);
            if ($scope.published === 'Y')
                setPublishState('N');
            $scope.editing = false;
        });
    };
    $scope.asGroupMenu = function() {
        http2.post('/rest/mp/call/menu/update?k='+$scope.editing.menu_key, {url:''}, function(rsp) {
            angular.extend($scope.editing, rsp.data);
            $scope.editing.hasReply = false;
            $scope.edit($scope.editing);
            setPublishState('N');
        });
    };
    $scope.setReply = function(){
        $scope.$broadcast('mattersgallery.open', function(aSelected, matterType){
            if (aSelected.length === 1) {
                var p = {
                    matter_type: matterType,
                    matter_id: aSelected[0].id
                };
                http2.post('/rest/mp/call/menu/setreply?k='+$scope.editing.menu_key, p, function(rsp) {
                    if (rsp.data.menu_key) {
                        if ($scope.editing.published != rsp.data.published)
                            setPublishState(rsp.data.published);
                        angular.extend($scope.editing, rsp.data);
                    }
                    $scope.edit($scope.editing);
                });
            }
        });
    };
    $scope.update = function(name) {
        if (!angular.equals($scope.editing, $scope.persisted)) {
            var p = {};
            p[name] = $scope.editing[name];
            http2.post('/rest/mp/call/menu/update?k='+$scope.editing.menu_key, p, function(rsp) {
                if (rsp.data.menu_key) {
                    angular.extend($scope.editing, rsp.data);
                    $scope.edit($scope.editing)
                };
                if (/menu_name|url|asview/.test(name))
                    setPublishState('N');
            });
        }
    };
    $scope.updateKey = function() {
        var k = $scope.persisted.menu_key;
        http2.post('/rest/mp/call/menu/update?k='+k, {'menu_key':$scope.editing.menu_key}, function(rsp) {
            if (rsp.data.menu_key) {
                angular.extend($scope.editing, rsp.data);
                $scope.edit($scope.editing)
            };
            if (/menu_name|url|asview/.test(name))
                setPublishState('N');
        });
    };
    $scope.publish = function() {
        http2.get('/rest/mp/call/menu/publish', function(rsp) {
            setPublishState('Y');
        });
    };
    $scope.$on('orderChanged', function(e, moved){
        if (-1 === $scope.menu.indexOf(moved)){
            var pos1,pos2,button,pos;
            for(pos1=0;pos1<$scope.menu.length;pos1++) {
                button = $scope.menu[pos1]; 
                if (button.sub.indexOf(moved) === -1)
                    continue;
                pos2 = button.sub.indexOf(moved);
                break;
            }
            pos = {'l1_pos':pos1+1,'l2_pos':pos2+1};
            http2.post('/rest/mp/call/menu/setpos?k='+moved.menu_key, pos, function() {
                setPublishState('N');
            });
        } else {
            var pos1 = $scope.menu.indexOf(moved);
            http2.post('/rest/mp/call/menu/setpos?k='+moved.menu_key, {'l1_pos':pos1+1}, function() {
                setPublishState('N');
            });
        }
    });
    http2.get('/rest/mp/call/menu', function(rsp){
        $scope.menu = [];
        for (var i in rsp.data) {
            var button = rsp.data[i];
            if (button.url) {
                button.replySrc = 'url';
            } else if (button.matter_type) {
                button.replySrc = 'matter';
            }
            if (button.l2_pos == 0) {
                button.sub = [];
                $scope.menu.push(button);
            } else {
                $scope.menu[$scope.menu.length-1].sub.push(button);
            }
        }
        if ($scope.menu.length > 0) {
            $scope.published = $scope.menu[0].published;
            $scope.edit($scope.menu[0]);
        }
    });
}]);
