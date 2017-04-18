angular.module('myApp')
.controller('MainController',['$cookieStore','$scope','$location','adminSeverExit','isLogin','usermMsg',function($cookieStore,$scope,$location,adminSeverExit,isLogin,usermMsg,$rootScope){
  var currentLocation = $location.path();
  // $scope.isLogin = isLogin.veriLogin();
  $scope.currentType = currentLocation.substring(7); 
  $scope.menuState={
    show: false
  } 
  // 验证信息
  usermMsg.veriLogin().then(function(data){
    if(data.status === 200){
      $scope.isLogin = true;
      $scope.islogmsg = data.data.nickName;
    }else{
      $scope.isLogin = false;
    }
  });
  //获取信息
  usermMsg.veriLogin().then(function(data){
    $scope.userRole = data.data.sysRoleId;
  });
  // 显示下拉
  $scope.changeTab = function(type,$event){  
      $scope.currentType = type; 
      $event.stopPropagation();
      if(type === 'page1' || type === 'page4') {
        $scope.menuState.show = true;
      }else{
        $scope.menuState.show=false;
      }
  };
  $scope.loinOut = function(){
    adminSeverExit.servLoginout();
  } 
}])