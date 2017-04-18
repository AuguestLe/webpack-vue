angular.module('myApp')
  .controller('NoteController',function ($log,$scope,cityServer,cityMsgdata,noteSubmit,$rootScope,commAlertService) {
    $scope.init = function () {
      $scope.cityList = {
        title:'请选择店铺',
        value:''
      };
      $scope.stueList = {
        title:'激活',
        value:'1'
      };
      $scope.pagemsg= {
        'pageNo' : 1,
        'pageSize':10
      }
      $scope.pageUsername = '';
      $scope.cityFilter = function(item){
        return  item.cityId != undefined;
      }
      cityMsgdata.pageoSearch($scope.pagemsg).then(function(data){
        $scope.citygrlist = data.list;
        $scope.totalItems = data.total; // 显示总条数
        $scope.currentPage = 1; // 当前页
        $scope.maxSize = 5; //显示几个
      })
      $scope.pageChanged = function() {
        $scope.pagemsg.pageNo = $scope.currentPage;
        cityMsgdata.pageoSearch($scope.pagemsg).then(function(data){
          $scope.citygrlist = data.list;
        })
      };  
      //分页
    };
    $scope.noteSlidown = function($event){
      if($scope.notpubishow ){
        $scope.notpubishow = false;
         $scope.pagemsg.pageNo = $scope.currentPage= 1;
        cityMsgdata.pageoSearch($scope.pagemsg).then(function(data){
          $scope.citygrlist = data.list;
        })
      } else {
        $scope.notpubishow = true;
      }
    }
    $scope.changeValue = function($event){
      var _this = $event.target;
      $scope.cityList.title = _this.innerHTML;
      $scope.cityList.value = _this.getAttribute('value');
      $scope.notpubishow = false;
      $scope.pagemsg.pageNo = $scope.currentPage= 1;
      cityMsgdata.pageoSearch($scope.pagemsg).then(function(data){
        $scope.citygrlist = data.list;
      })
    }
    $scope.changeStueValue = function($event){
      var _this = $event.target;
      $scope.stueList.title = _this.innerHTML;
      $scope.stueList.value = _this.getAttribute('value');
    }

    //新建用户
    $scope.notesubmit = function(){
      var obj = {};
      commAlertService.alertService().closeAlert();
      obj.dealerId = $scope.cityList.value; //店名
      obj.realName = $scope.noteUserName; //姓名
      obj.mobile = $scope.notePhone; //手机号
      // obj.nickName = $scope.notePhone; //登录名
      obj.password = $scope.notepassword; //登录密码
      obj.status = $scope.stueList.value; //状态
      noteSubmit.noteGet(obj).then(function(data){
        if(data.status === 200){
          $rootScope.$state.go('admin.page1');
        }else{
          commAlertService.alertService().add('danger', data.msg,3000);
        }
        
      })
    }
    
  });
