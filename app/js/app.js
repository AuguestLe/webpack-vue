var myApp = angular.module('myApp',['ui.router','ngCookies','ng','ngMessages','ui.bootstrap','angularFileUpload']);
myApp.run(function($rootScope,$state,$stateParams,$http){
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$state.isLogin = false;
  // $httpProvider.interceptors.push(HttpInterceptor);
  //$http.defaults.headers.post ={'Content-Type':'application/x-www-form-urlencoded'};
});
//myApp.constant('API_SERVER','http://192.168.0.124:8082')
// myApp.constant('API_SERVER','http://testcheshangadmin.jingzhengu.com');
myApp.constant('API_SERVER','http://cheshangadmin.jingzhengu.com');
// myApp.constant('API_SERVER','http://192.168.7.225:8080')
myApp.constant('API_PARMS',function(obj){
  var query = '';
  var name, value, fullSubName, subName, subValue, innerObj, i;
  for (name in obj) {
    value = obj[name];
    if (value instanceof Array) {
      for (i = 0; i < value.length; ++i) {
        subValue = value[i];
        fullSubName = name + '[]';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += param(innerObj) + '&';
      }
    } else if (value instanceof Object) {
      for (subName in value) {
        subValue = value[subName];
        fullSubName = subName;
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += param(innerObj) + '&';
      }
    } else if (value !== undefined && value !== null) {
      query += encodeURIComponent(name) + '='
        + encodeURIComponent(value) + '&';
    }
  }
  return query.length ? query.substr(0, query.length - 1) : query;
})
myApp.config(function($httpProvider){
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';  
  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';  
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.defaults.transformRequest = [function(data)  
  {  
      /** 
       * The workhorse; converts an object to x-www-form-urlencoded serialization. 
       * @param {Object} obj 
       * @return {String} 
       */  
      var param = function(obj)  
      {  
          var query = '';  
          var name, value, fullSubName, subName, subValue, innerObj, i;   

          for(name in obj)  
          {  
              value = obj[name];  
              if(value instanceof Array)  
              {  
                  for(i=0; i<value.length; ++i)  
                  {  
                      subValue = value[i];  
                      fullSubName = name + '[' + i + ']';  
                      innerObj = {};  
                      innerObj[fullSubName] = subValue;  
                      query += param(innerObj) + '&';  
                  }  
              }  
              else if(value instanceof Object)  
              {  
                  for(subName in value)  
                  {  


                      subValue = value[subName];  
                      if(subValue != null){  
                          // fullSubName = name + '[' + subName + ']';  
                          //user.userName = hmm & user.userPassword = 111  
                          fullSubName = name + '.' + subName;  
                          // fullSubName =  subName;  
                          innerObj = {};  
                          innerObj[fullSubName] = subValue;  
                          query += param(innerObj) + '&';  
                      }  
                  }  
              }  
              else if(value !== undefined ) //&& value !== null  
              {  
                  query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';  
              }  
          }  


          return query.length ? query.substr(0, query.length - 1) : query;  
      };  


      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;  
  }]  
  $httpProvider.defaults.useXDomain = true;
  
});
myApp.config(function($stateProvider, $urlRouterProvider,$locationProvider){
  var initState = function() {
    $state.go('login');
  };
  $urlRouterProvider.otherwise('login');
  $locationProvider.hashPrefix('');
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl:"dist/views/login.html",
      cache: true,
      controller: 'loginController'
    })
    .state('admin', {
      url: '/admin',
      templateUrl:"dist/views/admin.html",
      abstract: true,
      controller: 'MainController'
    })
    .state('admin.page1', {
      url: '/page1',
      templateUrl:"dist/views/page1.html",
      cache: true,
      controller: 'pageController'
    })
    .state('admin.page2', {
      url: '/page2',
      templateUrl:"dist/views/page2.html",
      cache: true,
      controller: 'pagetcController'
    })
    .state('admin.page4', {
      url: '/note',
      templateUrl:"dist/views/note.html",
      cache: true,
      controller: 'NoteController'
    })
    .state('admin.home', {
      url: '/home',
      templateUrl:"dist/views/home.html",
      cache: true,
      controller: 'homeController'
    })
    .state('admin.resetpassword', {
      url: '/resetpassword',
      templateUrl:"dist/views/resetpassword.html",
      cache: true,
      controller: 'resetController'
    });
});
//aler