angular.module('myApp')
  .controller('homeController',function ($log,$scope,$http,$timeout,$state,$stateParams,$rootScope,$log,homeServer,commAlertService,$uibModal) {
    $scope.init = function () {
      $scope.myCheckd = [];
      $scope.homeList = [];
      $scope.cityList = {
        title:'管理员',
        value:'2'
      };
      $scope.stueList = {
        title:'激活',
        value:'1'
      };
      var homePage = $scope.homePage = {
        pageNo:1,
        pageSize:10
      };

      homeServer.getHomeList(homePage).then(function(data){
        $scope.homeList = data.list;
        $scope.totalItems = data.total; // 显示中条数
        $scope.currentPage = 1; // 当前页
        $scope.maxSize = 5; //显示几个
      });
      $scope.pageChanged = function() {
        $scope.homePage.pageNo = $scope.currentPage;
        homeServer.getHomeList($scope.homePage).then(function(data){
          $scope.homeList = data.list;
          $scope.select_all = false;
          $scope.select_one = false;
        })
      }; 
      // 新建用户
      $scope.animationsEnabled = true;
      $scope.homesubmit = function(){
        var userInfo = $scope.userInfo = {
            sysRoleId:$scope.cityList.value, // 用户类型
            userName:$scope.username,  // 用户姓名
            mobile:$scope.userphone,    //登录账号、手机号
            password:$scope.homepassword,  // 密码
            status:$scope.stueList.value     //激活状态
        };
        var dataInit = {
          pageNo:1,
          pageSize:10
        }
        var dataStuts = true;
        homeServer.createUser(userInfo).then(function(data){
          commAlertService.alertService().closeAlert();
          if(data.data){
            homeServer.getHomeList(dataInit).then(function(data){
              $scope.homeList = data.list;
              $scope.username ='';
              $scope.userphone='';
              $scope.homepassword = '';
            })
          }else{
            commAlertService.alertService().add('danger', data.msg ,3000);
          }
        });
      };
      $scope.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
      };
      // 全选开始
      $scope.allchekNum = 0;
      $scope.selectAll = function(){ 
        if($scope.select_all) {
            $scope.allchekNum = 10;
            $scope.select_one = true;
            $scope.myCheckd = [];
            angular.forEach($scope.homeList,function(item,i){
                $scope.myCheckd.push(item.id);
            });
        }else{
            $scope.allchekNum= 0
            $scope.select_one = false;
            $scope.myCheckd = [];
        }
      }
      $scope.select_two = function(id,event){
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
            $scope.select_all = true;
        }else{
            $scope.select_all = false;
        }
        console.log($scope.myCheckd);
      }
      // 删除
      $scope.homedel = function(){
        commAlertService.alertService().closeAlert();
        if($scope.myCheckd.length > 0){
          var obj = {
            del:'1'
          }
          // 提示
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'dist/views/myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 100
          });  
          modalInstance.result.then(function (selectedItem) {
            // $scope.selected = selectedItem;
            if(selectedItem){
              homeServer.homeDelete($scope.myCheckd,obj).then(function(data){
                if(data.data ===1){
                  homeServer.getHomeList($scope.homePage).then(function(data){
                    $scope.homeList = data.list;
                    $scope.select_all = false;
                    $scope.select_one = false;
                  })
                  $scope.myCheckd = [];
                }else{
                  commAlertService.alertService().add('danger', data.msg ,3000);
                } 
              })
            }
          });
          // 提示结束
        }
      };
      // 禁用
      $scope.homeDisable = function(){
        commAlertService.alertService().closeAlert();
        if($scope.myCheckd.length > 0){
          var obj = {
            status:'0'
          }
          homeServer.homeDelete($scope.myCheckd,obj).then(function(data){
            if(data.status === 200){
              homeServer.getHomeList($scope.homePage).then(function(data){
                $scope.homeList = data.list;
                $scope.select_all = false;
                $scope.select_one = false;
              })
              $scope.myCheckd = [];
            } else{
              commAlertService.alertService().add('danger', data.msg ,3000);
            } 
          })
        }
      };
      // 激活
      $scope.homeActive = function(){
        if($scope.myCheckd.length > 0){
          var obj = {
            status:'1'
          }
          homeServer.homeDelete($scope.myCheckd,obj).then(function(data){
            if(data.status === 200){
              homeServer.getHomeList($scope.homePage).then(function(data){
                $scope.homeList = data.list;
                $scope.select_all = false;
                $scope.select_one = false;
              })
              $scope.myCheckd = [];
            } else{
              commAlertService.alertService().add('danger', data.msg ,3000);
            } 
          })
        }
      };
      // 重置
      $scope.repetpassword = function(id){
        if(id){
         homeServer.resetPassword(id).then(function(data){
            commAlertService.alertService().closeAlert();
            if(data.status === 200){
              homeServer.getHomeList($scope.homePage).then(function(data){
                $scope.homeList = data.list;
                commAlertService.alertService().add('success', '密码重置成功',3000);
              })
              $scope.myCheckd = [];
            }else{
              commAlertService.alertService().add('danger', data.msg ,3000);
            } 
          })
        }
      };
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
})
 //弹窗的控制器
.controller('ModalInstanceCtrl',function(/*info,*/$scope,$uibModalInstance){
    // $scope.info = info;
    $scope.ok = function () {
        $uibModalInstance.close(true);
    };
    $scope.cancel = function () {
       $uibModalInstance.close(false);
    };
})

