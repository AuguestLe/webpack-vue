angular.module('myApp')
  .controller('loginController', function ($scope,$http,$timeout,$state,$stateParams,$rootScope,$log,adminSever) {
    $scope.loginError =false
    $scope.loginCheck = function(){
      var obj = {
        'userName':$scope.user,
        'password':$scope.pwd
      }
      $scope.loginError= !$scope.loginError;
      var userStatus = adminSever.getLogin(obj);
      userStatus.then(function(data){
        if(data.status != 200){
          $scope.loginError = true;
          $scope.logintip = data.msg;
          $timeout(function(){
            $scope.loginError= false;
          },800) 
          console.log($scope.loginError);
        }else{
          var loginData = data.data;
          if(loginData.sysRoleId ===2){
            $rootScope.$state.go('admin.page2');
          }else{
            $scope.logintip = '你不是普通用户';
            $timeout(function(){
              $scope.loginError= false;
            },800) 
          }
          console.log('登录开始走了');
        }
      })
      
    }
    // 账号验证 
    $scope.superloginCheck = function(){
      var obj = {
        'userName':$scope.user,
        'password':$scope.pwd
      }
      $scope.loginError= !$scope.loginError;
      var userStatus = adminSever.getLogin(obj);
      userStatus.then(function(data){
        if(data.status != 200){
          $scope.loginError = true;
          $scope.logintip = data.msg;
          $timeout(function(){
            $scope.loginError= false;
          },800) 
          console.log($scope.loginError);
        }else{
          var loginData = data.data;
          if(loginData.sysRoleId ===1){
            $rootScope.$state.go('admin.home');
          }else{
            $scope.logintip = '你不是超管用户';
            $timeout(function(){
              $scope.loginError= false;
            },800) 
          }
          console.log('登录开始走了');
        }
      })
      
    }
  })
