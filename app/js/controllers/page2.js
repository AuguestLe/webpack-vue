angular.module('myApp')
  .controller('pagetcController', function ($scope,cityServer,cityMsgdata,commAlertService,$uibModal) {
    var cheList = [];
    $scope.dealerName='';
    $scope.currentPage = 1;
    $scope.m = [];
    $scope.checkedList = [];
    $scope.myCheckd = [];
    $scope.init = function () {
        $scope.cityList = {
            title:'请选择城市',
            value:''
        };
        $scope.stueLList = {
            title:'请选择状态',
            value:''
        };
    };
    $scope.pagemsg= {
        'pageNo' : 1,
        'pageSize':10
    };
    cityServer.getCity().then(function(data){
        $scope.citygrlist = data.list;
    });
    // fenye
    cityMsgdata.pageoSearch($scope.pagemsg).then(function(data){
        $scope.userCitList = data.list;
        $scope.totalItems = data.total; // 显示中条数
        $scope.currentPage = 1; // 当前页
        $scope.maxSize = 5; //显示几个
    });

    $scope.pageChanged = function() {
        $scope.pagemsg.pageNo = $scope.currentPage;
        cityMsgdata.pageoSearch($scope.pagemsg).then(function(data){
            $scope.userCitList = data.list;
            $scope.select_all = false;
            $scope.select_one = false;
        })
    };
    //提交
    $scope.dataMsg = function(){
        var obj = {};
        commAlertService.alertService().closeAlert();
        obj.cityId  = $scope.cityList.value;
        obj.carDealerName  = $scope.dealerName;
        cityMsgdata.getMsgdata(obj).then(function(data){
            if(data.status === 200){
                $scope.pagemsg.pageNo = $scope.currentPage = 1;
                cityMsgdata.pageoSearch($scope.pagemsg).then(function(data){
                    $scope.userCitList = data.list;
                });
                $scope.cityList = {
                    title:'请选择城市',
                    value:''
                };
                $scope.dealerName = '';
            }else{
                commAlertService.alertService().add('danger', data.msg,3000);
            }
        });
    };

    $scope.changeValue = function($event){
        var _this = $event.target;
        $scope.cityList.title = _this.innerHTML;
        $scope.cityList.value = _this.getAttribute('value');
    }
    $scope.changeStueValue = function($event){
        var _this = $event.target;
        $scope.stueList.title = _this.innerHTML;
        $scope.stueList.value = _this.getAttribute('value');
    }

    //全选开始
    $scope.allchekNum = 0;
    $scope.selectAll = function(){
        if($scope.select_all) {
            $scope.allchekNum = 10;
            $scope.select_one = true;
            $scope.myCheckd = [];
            angular.forEach($scope.userCitList,function(item,i){
                $scope.myCheckd.push(item.id);
                $scope.m[item.id]=true;

            });
        }else{
            $scope.allchekNum= 0
            $scope.select_one = false;
            $scope.myCheckd = [];
            $scope.m = [];
        }
    }
    $scope.select_two = function(event,id){
        var _this = event.target;
        id = parseInt(id);
        if(_this.checked){
            $scope.myCheckd.push(id);
            $scope.allchekNum++;
        }else{

            $scope.myCheckd.splice($.inArray(id,$scope.myCheckd),1);
            $scope.allchekNum--;
        }
        if($scope.allchekNum === 10){
            $scope.allCheck = true;
        }else{
            $scope.allCheck = false;
        }
    }
    //删除开始
    $scope.delteData = function(){
        var obj = {};
        obj.ids = $scope.myCheckd.join("-");
        commAlertService.alertService().closeAlert();
        // 提示
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'dist/views/myModalContent.html',
        controller: 'ModalInstanceCtrl'
      });  
      modalInstance.result.then(function (selectedItem) {
        // $scope.selected = selectedItem;
        if(selectedItem){
            cityMsgdata.delMsgdata(obj).then(function(data){
                console.log(data);
                if(data.status === 200){
                    $scope.pagemsg.pageNo = $scope.currentPage;
                    cityMsgdata.pageoSearch($scope.pagemsg).then(function(data){
                        $scope.userCitList = data.list;
                        $scope.select_one = false;
                        $scope.select_all = false;
                        $scope.myCheckd = [];
                    })
                }else{
                    commAlertService.alertService().add('danger', data.msg,3000);
                }
            });
        }
      });
      // 提示结束
        
    }

});


