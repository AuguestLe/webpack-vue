angular.module('myApp')
.factory('usermMsg', function($http,$q,API_SERVER,API_PARMS,$cookieStore,$rootScope) {
  var service = {}
  service.veriLogin = function(){
    var deferred = $q.defer();
    if($cookieStore.get("userInfo") != undefined){
      var userInfo = $cookieStore.get("userInfo");
      $http({
        method:'post',
        url:API_SERVER+'/sysUser/getUserInfo',
        data:API_PARMS(userInfo)
      }).then(function(data){
        if(data.data.status === 202 || data.data.status === 700){
            $rootScope.$state.go('login');
            $cookieStore.remove("userInfo");
        }else{
            deferred.resolve(data.data);
        }  
      }).catch(function(data){
        $cookieStore.remove("userInfo"); 
        $rootScope.$state.go('login');
      })
    }
  return deferred.promise;  
  }
  return service;
});
