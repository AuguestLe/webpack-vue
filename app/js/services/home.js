angular.module('myApp')
.factory('homeServer', function($http,$q,$cookieStore,API_SERVER,API_PARMS,$rootScope) {
	var service = {}
    service.getHomeList = function(obj){
    	var deferred = $q.defer();
    	var userInfo = $cookieStore.get("userInfo");
    	userInfo.pageNo = obj.pageNo;
    	userInfo.pageSize = obj.pageSize;
    	$http({
		    method:'post',
		    url:API_SERVER+'/sysUser/getSysUserList',
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
		return deferred.promise;  
    }
    service.createUser = function(obj){
    	var deferred = $q.defer();
    	var userInfo = $cookieStore.get("userInfo");
    	userInfo.sysRoleId = obj.sysRoleId;
    	userInfo.userName = obj.userName;
    	userInfo.mobile = obj.mobile;
    	userInfo.password = obj.password;
    	userInfo.status = obj.status;
    	// deferred.resolve(userInfo);
    	$http({
		    method:'post',
		    url:API_SERVER+'/sysUser/insertSysUser',
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
		return deferred.promise;  
    };
    service.homeDelete = function(arr,obj){
    	var deferred = $q.defer();
    	var userInfo = $cookieStore.get("userInfo");
    	if(arr){
    		userInfo.ids =arr.join(',');
    	}
    	if(obj.del){
    		userInfo.delete = obj.del;
    	}
    	if(obj.status){
    		userInfo.status = obj.status;
    	}
    	$http({
		    method:'post',
		    url:API_SERVER+'/sysUser/updateSysUser',
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
		return deferred.promise;  
    };
    service.resetPassword = function(obj){
        var deferred = $q.defer();
        var userInfo = $cookieStore.get("userInfo");
        userInfo.userId = obj;
        $http({
            method:'post',
            url:API_SERVER+'/sysUser/reSetPassword',
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
        return deferred.promise;  
    }
    return service;
})

