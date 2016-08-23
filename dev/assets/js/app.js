var myApp=angular.module('myApp', ['ui.router','ngSanitize','ui.bootstrap','angularModalService','Routing','wt.responsive']);

myApp.config(function($stateProvider, $urlRouterProvider, routerProvider) {         
 
    $stateProvider                   
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('/', {
            url: '/',
            templateUrl: 'modules/aboutToolkit/index.html'
        });

        $urlRouterProvider.otherwise("/");
        routerProvider.setCollectionUrl('assets/data/modules.json');
        
});

myApp.controller('MainController', function ($scope, router) {
        $scope.reload = function() {
            router.setUpRoutes();
        };
});

myApp.run(function($rootScope,modulesService) {
   modulesService.moduleData().then(function(httpData) {
       $rootScope.moduledata=httpData.data.modules;
        
    });
})

angular.module('Routing', ['ui.router'])
    .provider('router', function ($stateProvider) {
 
        var urlCollection;
 
        this.$get = function ($http, $state) {
            return {
                setUpRoutes: function () {
                    $http.get(urlCollection).success(function (collection) {
                      var wrapper = collection.modules;
                      for(var  i =0;i < wrapper.length;i++){
                              if (!$state.get(wrapper[i].routeObj.name)) {
                                $stateProvider.state(wrapper[i].routeObj.name, wrapper[i].routeObj.detail);
                            }
                      }
                    });
                }
            }
        };
 
        this.setCollectionUrl = function (url) {
            urlCollection = url;
        }
    })
 
    .run(function (router) {
        router.setUpRoutes();
});

myApp.service('modulesService', function($http){
    this.moduleData= function(){
        return $http.get('assets/data/modules.json');
    };   
});

myApp.controller('modulesController',['$scope','modulesService', function($scope,modulesService){
    modulesService.moduleData().then(function(httpData) {
        $scope.moduleData=httpData.data.modules;
        
    });

}]);



/*myApp.directive('fullSpec', function(){
    return {
      restrict: 'AE',
      replace: true,
      scope:{name:"@"},
      template:"<a href='javascript:void(0)' class='specsLink'>{{name}}</a>",
      link:function($scope, element) {
            angular.element('.fullSpecs').hide();
        element.bind('click',function() {
            angular.element(this).toggleClass('specActive').next().closest('.fullSpecs').slideToggle();
        });
      }

      };
});*/



myApp.controller('formSearchController',function($scope,$state,modulesService){
 $scope.selectedModule = "";
  $scope.moduleData = [];
  $scope.modulesName = [];
  modulesService.moduleData().then(function(httpData) {
        $scope.moduleData=httpData.data.modules;
        for(var i=0;i<$scope.moduleData.length;i++){
         $scope.modulesName.push($scope.moduleData[i].name);
      }
      availableTags = $scope.modulesName;       
  });

  $scope.clicker = function(){
    var found = $.inArray($scope.selectedModule, $scope.modulesName) > -1;
      var val = $scope.selectedModule.split(" ");
      var url = val[0].toLowerCase();
      var finalurl = url.concat(val[1]); 
      if(found){
        $state.go(finalurl);
        }
  }
});



myApp.directive('formSearch', function(){
    return {
      restrict: 'AE',
      replace: true,
      controller: 'formSearchController',
      scope:{name:"@"},
      template:'<form id="MainWrap" autocomplete="off" action="" method="GET"><label for"search"="">Search for modules</label><div class="fieldandsubmitbar"><input type="text" ng-model="selectedModule" id="tags" name="query" placeholder="Keywords" ng-blur="clicker()"> <input type="submit" value=""></div> </form>'
      };  
});


myApp.controller('deviceViewController',function($scope,$window){
   var openedwindow = '';
  $scope.viewshow = true; 

  if(getParameterByName('hidelinks')){
       $scope.viewshow = false; 
    }
  
  $scope.openwindow = function(view,orientation) {
    var wd,ht;
    if (openedwindow !== ''){
        openedwindow.close();
     }

    if(view == 'mobile'){
      if(orientation == 'portrait'){
        wd = '320';
        ht = '480';  
      }else{
        wd = '480';
        ht = '320'; 
      }
    }
    else{
      if(orientation == 'portrait'){
        wd = '768';
        ht = '1024'; 
      }
      else{
        wd = '1024';
        ht = '768'; 
      }
    }
      var val = window.location.href;
        openedwindow = $window.open( val+ '?hidelinks=true','targetWindow','toolbar=no,location=no, status=no, menubar=no, scrollbars=yes,resizable=yes,width='+ wd + ', height='+ht);

    };

});

myApp.directive('deviceView',function(){

  return{

    restrict: 'AE',
    scope:{
        openwindow: '&'
    },
    templateUrl: 'templates/device-view.html' ,
    controller: 'deviceViewController',
    replace:true

  };

});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function() {
    $( "#tags" ).autocomplete({
      source: function(request, response){
        var scope = angular.element(document.getElementById("tags")).scope();
        response(scope.modulesName);
      },
      select: function (event, ui) {
      var scope = angular.element(document.getElementById("tags")).scope();
      scope.selectedModule = ui.item.value;
      scope.$apply;
      scope.clicker();
      }
    });
});



myApp.directive('compile', ['$compile', function ($compile) {   
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}])

