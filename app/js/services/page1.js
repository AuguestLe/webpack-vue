angular.module('myApp')
.factory('page1Server', function($http,$q,API_SERVER,API_PARMS,$cookieStore,$rootScope) {
  var service = {}
  service.pageoSearch = function(obj){
    var deferred = $q.defer();
    var userInfo = $cookieStore.get("userInfo");
    obj.token = userInfo.token;
    obj.loginName = userInfo.loginName;
    $http({
      method:'post',
      url:API_SERVER+'/admin/cust/getfindDealerCustomer',
      data:obj
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
  //激活
  service.homeActive = function(arr){
      var deferred = $q.defer();
      var userInfo = $cookieStore.get("userInfo");
      if(arr){
        userInfo.ids =arr.join('-');
      }
      $http({
        method:'post',
        url:API_SERVER+'/admin/cust/activeDealerCustomerByIds',
        data:userInfo
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
  // 禁用
  service.homeNactiv = function(arr){
      var deferred = $q.defer();
      var userInfo = $cookieStore.get("userInfo");
      if(arr){
        userInfo.ids =arr.join('-');
      }
      $http({
        method:'post',
        url:API_SERVER+'/admin/cust/forbiddenDealerCustomerByIds',
        data:userInfo
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
  // 删除
  service.homeDelete = function(arr,obj){
      var deferred = $q.defer();
      var userInfo = $cookieStore.get("userInfo");
      if(arr){
        userInfo.ids =arr.join('-');
      }
      $http({
        method:'post',
        url:API_SERVER+'/admin/cust/deleteDealerCustomerByIds',
        data:userInfo
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
  return service;
});
angular.module('myApp')
.value("alerts",[])
.factory('commAlertService',['$rootScope','$timeout','alerts',function($rootScope,$timeout,alerts){
  return {
    "alertService":function(){
      var alertJson = {};
      $rootScope.alerts = alerts;
      alertJson.add = function(type,msg,time){
        $rootScope.alerts.push({'type': type, 'msg': msg,'close':function(){
          alertJson.closeAlert(this);
        }});
        //如果设置定time的话就定时消失
        if(time){
          $timeout(function(){
            $rootScope.alerts = [];
          },time);
        }
      };
      alertJson.closeAlert = function(alert){
        $rootScope.alerts.splice($rootScope.alerts.indexOf(alert),1);
      };
      return alertJson;
    }
  }
}])
