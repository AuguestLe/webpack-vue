angular.module('myApp')
.factory('isLogin', function($http,$q,API_SERVER,API_PARMS,$cookieStore,$rootScope) {
  var service = {}
  service.veriLogin = function(){
    var deferred = $q.defer();
    if($cookieStore.get("userInfo") != undefined){
      var userInfo = $cookieStore.get("userInfo");
      $http({
        method:'post',
        url:API_SERVER+'/sysUser/isLogin',
        data:API_PARMS(userInfo)
      }).then(function(data){
        if(data.data.status === 202 || data.data.status === 700){
            $rootScope.$state.go('login');
            $cookieStore.remove("userInfo");
        }else{
            deferred.resolve(data.data);
        }  
      }).catch(function(data){
        $rootScope.$state.go('login');
        $cookieStore.remove("userInfo"); 
      })
    }else{
      deferred.resolve('false');
      $rootScope.$state.go('login');
    }
    return deferred.promise;  
  };
  service.resetPassword = function(obj){
    var deferred = $q.defer();
    if($cookieStore.get("userInfo") != undefined){
      var userInfo = $cookieStore.get("userInfo");
      userInfo.userName = userInfo.loginName; // 旧密码
      userInfo.password = obj.password; // 旧密码
      userInfo.newPassword = obj.newPassword; // 新密码
      userInfo.confirmPassword = obj.confirmPassword; // 新密码
      $http({
        method:'post',
        url:API_SERVER+'/sysUser/updatePassword',
        data:API_PARMS(userInfo)
      }).then(function(data){
        deferred.resolve(data.data);
        if(data.data.status === 200){
          $rootScope.$state.go('login');
          $cookieStore.remove("userInfo");
        } else if(data.data.status === 202 || data.data.status === 700){
            $rootScope.$state.go('login');
            $cookieStore.remove("userInfo");
        }
      }).catch(function(data){
        $rootScope.$state.go('login');
        $cookieStore.remove("userInfo"); 
      })
    }else{
      deferred.resolve('false');
      $rootScope.$state.go('login');
    }
    return deferred.promise;  
  };
  return service;
});
