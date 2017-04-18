angular.module('myApp')
.factory('cityMsgdata', function($http,$q,API_SERVER,API_PARMS,$cookieStore,$rootScope) {
  var service = {};
    service.pageoSearch = function(obj){
      var deferred = $q.defer();
      var userInfo = $cookieStore.get("userInfo");
      obj.token = userInfo.token;
      obj.loginName = userInfo.loginName;
      $http({
        method:'post',
        url:API_SERVER+'/admin/dealer/getDealerPageList',
        data:API_PARMS(obj)
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
      return deferred.promise;  
    };
    service.getMsgdata = function(obj){
      var deferred = $q.defer();
      var userInfo = $cookieStore.get("userInfo");
      obj.token = userInfo.token;
      obj.loginName = userInfo.loginName;
      $http({
        method:'post',
        url:API_SERVER+'/admin/dealer/createDealer',
        data:API_PARMS(obj)
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
    return deferred.promise;
    }
    service.delMsgdata = function(obj){
        var deferred = $q.defer();
        var userInfo = $cookieStore.get("userInfo");
        obj.token = userInfo.token;
        obj.loginName = userInfo.loginName;
        $http({
          method:'post',
          url:API_SERVER+'/admin/dealer/deleteDealerByIds',
          data:API_PARMS(obj)
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
        return deferred.promise;
      }
    return service;
});
