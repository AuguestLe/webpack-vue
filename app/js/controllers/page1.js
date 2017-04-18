angular.module('myApp')
  .controller('pageController',function ($log,$scope,FileUploader,cityServer,page1Server,$cookieStore,API_SERVER,commAlertService,$uibModal) {
    $scope.init = function () {
      $scope.myCheckd = [];
      $scope.userCitList = [];
      $scope.cityList = {
        title:'请选择城市',
        value:''
      };
      $scope.stueList = {
        title:'请选择状态',
        value:''
      };
      $scope.pagemsg= {
        'pageSize':10
      }
      $scope.pageUsername = '';
      cityServer.getCity().then(function(data){
        $scope.citygrlist = data.list;
      })
      $scope.cityFilter = function(item){
        return  item.cityId != undefined;
      }
      page1Server.pageoSearch($scope.pagemsg).then(function(data){
        $scope.userCitList = data.list;
        $scope.userCitList = data.list;
        $scope.totalItems = data.total; // 显示总条数
        $scope.currentPage = 1; // 当前页
        $scope.maxSize = 5; //显示几个
      })
      
      $scope.pageChanged = function() {
        $scope.pagemsg.pageNum = $scope.currentPage;
        page1Server.pageoSearch($scope.pagemsg).then(function(data){
          $scope.userCitList = data.list;
          $scope.select_all = false;
          $scope.select_one = false;
        })
      };  
      //分页
      // 查询
      $scope.userSearch = function(){
        var obj = $scope.obj = {};
        $scope.obj.cityId = $scope.cityList.value;
        $scope.obj.realName = $scope.pageUsername;
        $scope.obj.status = $scope.stueList.value;
        $scope.pagemsg.cityId = $scope.cityList.value;
        page1Server.pageoSearch(obj).then(function(data){
          $scope.userCitList = data.list;
          $scope.totalItems = data.total; // 显示总条数
          $scope.currentPage = 1; // 当前页
          $scope.maxSize = 5; //显示几个
        });
      };
      // 全选开始
      $scope.allchekNum = 0;
      $scope.selectAll = function(){ 
        if($scope.select_all) {
            $scope.allchekNum = 10;
            $scope.select_one = true;
            $scope.myCheckd = [];
            angular.forEach($scope.userCitList,function(item,i){
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
      }
      // 删除
      $scope.homedel = function(){
        commAlertService.alertService().closeAlert();
        if($scope.myCheckd.length > 0){
          // 提示
          var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'dist/views/myModalContent.html',
            controller: 'ModalInstanceCtrl'
          });  
          modalInstance.result.then(function (selectedItem) {
            // $scope.selected = selectedItem;
            if(selectedItem){
              page1Server.homeDelete($scope.myCheckd).then(function(data){
                if(data.status === 200){
                  page1Server.pageoSearch($scope.pagemsg).then(function(data){
                    $scope.userCitList = data.list;
                    $scope.userCitList = data.list;
                    $scope.totalItems = data.total; // 显示总条数
                    $scope.maxSize = 5; //显示几个
                  })
                  $scope.myCheckd = [];
                  $scope.select_one = false;
                  $scope.select_all = false;
                }else{
                  commAlertService.alertService().add('danger', data.msg,3000);
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
          page1Server.homeNactiv($scope.myCheckd).then(function(data){
            if(data.status ===200){
              page1Server.pageoSearch($scope.pagemsg).then(function(data){
                $scope.userCitList = data.list;
                $scope.select_all = false;
                $scope.select_one = false;
              })
              $scope.myCheckd = [];
            }else{
              commAlertService.alertService().add('danger', data.msg,3000);
            } 
          })
        }
      };
      // 激活
      $scope.homeActive = function(){
        commAlertService.alertService().closeAlert();
        if($scope.myCheckd.length > 0){
          page1Server.homeActive($scope.myCheckd).then(function(data){
            if(data.status ===200){
              page1Server.pageoSearch($scope.pagemsg).then(function(data){
                $scope.userCitList = data.list;
                $scope.select_all = false;
                $scope.select_one = false;
              })
              $scope.myCheckd = [];
            }else{
              commAlertService.alertService().add('danger', data.msg,3000);
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
    
   
    var userInfo = $cookieStore.get("userInfo");
    var uploader = $scope.uploader = new FileUploader({
      url:API_SERVER+'/admin/cust/fileUpload?token='+userInfo.token+'&loginName='+userInfo.loginName,
      queueLimit: 1,     //文件个数 
      alias:'uploadfile', 
      removeAfterUpload: true,   //上传后删除文件
      autoUpload : true
    });
    $scope.clearItems = function(){
      uploader.clearQueue();
    }
    $scope.uploader.filters.push({  
      name: 'customFilter',  
      fn: function (item, options) {  
        var type = '|' + item.type.slice(item.type.lastIndexOf('.') + 1) + '|';
        if((item.size/1024)>=1000){
          return false 
        }else{
          return '|sheet|'.indexOf(type) !== -1;
        }
          
      }  
    });
    uploader.onWhenAddingFileFailed = function (item /* {File|FileLikeObject} */, filter, options) {  
      commAlertService.alertService().closeAlert();
      if((item.size/1024)>=1000){
        commAlertService.alertService().add('danger', '文件大小必须小于1M',3000);
      }else{
        commAlertService.alertService().add('danger', '请选择excel表格文件！',3000);
      }
    };  
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      // console.log(response);
      commAlertService.alertService().closeAlert();
      if(response.status === 200){
        commAlertService.alertService().add('success', response.msg,3000);
      }else{
        commAlertService.alertService().add('danger', response.msg,3000);
      }
      page1Server.pageoSearch($scope.pagemsg).then(function(data){
        $scope.userCitList = data.list;
        $scope.userCitList = data.list;
        $scope.totalItems = data.total; // 显示总条数
        $scope.currentPage = 1; // 当前页
        $scope.maxSize = 5; //显示几个
      })
      $scope.myCheckd = [];
    };
    // 进度条
    // uploader.onProgressItem  = function(item, progress) {
    //   console.log(progress);
    // };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      commAlertService.alertService().closeAlert();
      commAlertService.alertService().add('danger', '文件大小必须小于1M,或者文件类型不对！',3000);
    };
  });
