
angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

angular.module('starter', ['ionic','chart.js','starter.config','underscore','slugifier','myapp.factories','angularMoment','ngStorage', 'ngCordova','ui.calendar','firebase', 'starter.controllers', 'starter.services','ngResource', 'starter.filters', 'angular-cache'])
.constant("FIREBASE_URL",'https://mynewtv.firebaseio.com')

.constant("server",'http://eurestkantine.com/eurest/wp-json/wp/v2/')
.value('nutritionixConst', {
  'appId' :'8abbcd8e',
  'appKey' : '36e8d264537037ee7e832a41902ffe57'
})
.constant("Config", {  "ProductUrl": "js/products.json",
})









.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

    
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	 if (window.cordova && window.cordova.InAppBrowser) {
      window.open = window.cordova.InAppBrowser.open;
    }
	 if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
            title: 'Sin conexión a internet',
            content: 'Ups!, No hay conexión a internet, inténtalo más tarde'
          })
          .then(function(result) {
            if(!result) {
              ionic.Platform.exitApp();
            }
          });
        }
}
	//Check for network connection
     function checkConnection() {
	    var networkState = navigator.connection.type;

	    var states = {};
	    states[Connection.UNKNOWN]  = 'Unknown connection';
	    states[Connection.ETHERNET] = 'Ethernet connection';
	    states[Connection.WIFI]     = 'WiFi connection';
	    states[Connection.CELL_2G]  = 'Cell 2G connection';
	    states[Connection.CELL_3G]  = 'Cell 3G connection';
	    states[Connection.CELL_4G]  = 'Cell 4G connection';
	    states[Connection.CELL]     = 'Cell generic connection';
	    states[Connection.NONE]     = 'No network connection';

	    console.log('Connection type: ' + states[networkState]);
	}
	


	document.addEventListener("offline", onOffline, false);

	function onOffline() {
	   // Handle the offline event
	  alertify.alert('you have no internet connection');
	}
	

	
	
  });
  
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider,CacheFactoryProvider,$sceDelegateProvider) {
$sceDelegateProvider.resourceUrlWhitelist(['FIREBASE_URL']);
$sceDelegateProvider.resourceUrlWhitelist([
'self',

])
 

  angular.extend(CacheFactoryProvider.defaults, { 
    'storageMode': 'localStorage',
    'capacity': 10,
    'maxAge': 10800000,
    'deleteOnExpire': 'aggressive',
    'recycleFreq': 10000
  })

  // Native scrolling
  if( ionic.Platform.isAndroid() ) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  };
   $compileProvider.directive('compile', function ($compile) {
        // directive factory creates a link function
        return function (scope, element, attrs) {
          scope.$watch(
              function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
              },
              function (value) {
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
      });
  

  $stateProvider

  // sets up our default state, all views are loaded through here
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  // this is the first sub view, notice menuContent under 'views', which is loaded through menu.html
  .state('app.posts', {
    url: "/posts",

    views: {
      'menuContent': {
        templateUrl: "templates/posts.html",
        controller: 'PostsCtrl'
      }
    }
  })
  //post
   .state('app.post', {
    url: "/posts/:postId",
    views: {
      'menuContent': {
        templateUrl: "templates/post.html",
        controller: 'PostCtrl'
      }
    }
  })
  //month's plan
  .state('app.monthsevent', {
    url: "/monthsevent",
    views: {
      'menuContent': {
        templateUrl: "templates/monthsplan.html",
        controller: 'MenuController'
      }
    }
	})
	 //eurest videos
  .state('app.newyoutube',{
    url:'/youtube',
    views:{
        'menuContent':{
            templateUrl: 'templates/newyoutube.html',
            controller: 'newyoutube'
        }
    }
})
 
  //eurest gallery
	.state('app.flickr', {
    url: '/flickr',
	views:{
	menuContent:{
    templateUrl: 'templates/flickr.html',
    controller: 'FlickrCtrl'
  }
  }
  })
 // eurest gallery album
  .state('app.album', {
    url: '/album/:id',
	views:{
	menuContent:{
    templateUrl: 'templates/album.html',
    controller: 'AlbumCtrl'
  }
  }
  })
  
   //eurest store
.state('app.products', {
		url: '/products',
		views: {
			'menuContent': {
				templateUrl: 'templates/products.html',
				controller: 'ProductsController'
			}
		}
	})
	.state('app.product', {
		url: '/product/:productId',
		views: {
			'menuContent': {
				templateUrl: 'templates/product.html',
				controller: 'ProductController'
			}
		}
	})
	 //instagram
   .state('app.lundbeckimages', {
    url: "/lundbeckimages",
    views: {
      'menuContent' :{
        templateUrl: "templates/lundbeckimages.html",
        controller: "ApiCtrl"
      }
    }
  })
  //recipe search
   .state('app.recipesearch', {
    url: "/recipesearch",
    views: {
      'menuContent' :{
        templateUrl: "templates/recipesearch.html",
        controller: "recipeController"
      }
    }
  })
	//bookmark

  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "templates/bookmarks.html",
        controller: 'BookmarksCtrl'
      }
    }
  })
   //feautres
  .state('app.features', {
      url: "/features",
      views: {
        'menuContent' :{
          	templateUrl: "templates/features.html",
		  		controller: "FeaturesCtrl"
        }
      }
    })
	//infographs
    .state('app.chart', {
    url: "/chart",
    views: {
      'menuContent': {
        templateUrl: "templates/chart.html",
        controller: 'ChartCtrl'
      }
    }
  })
  //edu videos
  
  
 
  
  //contact/feedback
   .state('app.feedback', {
    url: "/feedback",
    views: {
      'menuContent': {
        templateUrl: "templates/feedback.html",
        controller: 'feedbackCtrl'
      }
    }
  })
  //about us
  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html",

      }
    }
  })
  //nutri
  .state('app.nutrisearh', {
    url: "/nutrisearch",
    views: {
      'menuContent': {
        templateUrl: "templates/nutrition.html",
		controller: 'nutriCtrl'
      }
    }
  })
  //terms of use
   .state('app.terms', {
    url: "/terms",
    views: {
      'menuContent': {
        templateUrl: "templates/terms.html"
      }
    }
	 })
  
  
	 .state('app.calendar', {
      url: '/calendar',
      views: {
        'menuContent' : {
          templateUrl: 'templates/calendar.html',
          controller: 'CalendarController'
        }
      }
    })
	//quiz
	 .state('app.quiz', {
      url: '/quiz',
      views: {
        'menuContent' : {
          templateUrl: 'templates/quiz.html',
          controller: 'faqCtrl'
        }
      }
    })
	
  
  
   
  
  
	//eurest Event
	.state('app.eurestevent', {
    url: "/eurestevent",
    views: {
      'menuContent': {
        templateUrl: "templates/eurestplan.html",
        controller: 'EuresteventController'
      }
    }
	})
  
  //wikisearch
   .state('app.wikisearch', {
    url: "/wikisearch",
    views: {
      'menuContent': {
        templateUrl: "templates/wikisearch.html",
        controller: 'wikiController'
      }
    }
  })
  
  
  
   //Astro
  .state('app.astro', {
    url: "/astro",
	 cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/astroposts.html",
        controller: 'astroPostsCtrl'
      }
    }
  })
  
 
  
  
 
  
  
//youtube search
.state('app.youtubevideos',{
    url:'/youtubevideos',
    views:{
        'menuContent':{
            templateUrl: 'templates/youtubevideos.html',
            controller: 'youtubevideos'
        }
    }
})

 
  
   
 
   //todoapp
  .state('app.todoapp', {
    url: "/todoapp",
    views: {
      'menuContent': {
        templateUrl: "templates/todoapp.html",
        controller: 'todoCtrl'
      }
    }
  })
  
  
  
	
  
  
  
  //feedback1
   .state('app.feedbacknew', {
    url: "/feedbacknew",
    views: {
      'menuContent': {
        templateUrl: "templates/feedback1.html",
        controller: 'sendEmailCtrl'
      }
    }
  })
	
	   
  
   
	
	.state('app.weather', {
    url: "/weather",
    views: {
      'menuContent': {
        templateUrl: "templates/weather.html",
        controller: 'weatherCtrl'
      }
    }
  })
  

  
 
 
  
	
   //teameurest
   .state('app.teameurest', {
    url: "/teameurest",
    views: {
      'menuContent': {
        templateUrl: "templates/teameurest.html",
        controller: 'TeamCtrl'
      }
    }
  })
  
  
   
             

                   
  
 
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/posts');
});
