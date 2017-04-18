angular.module('myApp')
.controller('resetController',['$cookieStore','$scope','$location','adminSeverExit','isLogin','usermMsg',function($cookieStore,$scope,$location,adminSeverExit,isLogin,usermMsg,$rootScope){
  // 验证信息
  usermMsg.veriLogin().then(function(data){
    if(data.status === 200){
      $scope.usermobile = data.data.mobile;
    }
  });
 //修改密码
 $scope.paswordsubmit = function(){
  var obj = {};
  obj.userName = $scope.usermobile;
  obj.password = $scope.oldpassword;
  obj.newPassword = $scope.newpassword;
  obj.confirmPassword = $scope.refpassword;
  isLogin.resetPassword(obj).then(function(data){
    console.log(data);
    if(data.status === 200){
      $rootScope.$state.go('login');
    }
  })
 };
 
}])