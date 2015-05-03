# ngSharedObject

An [AngularJS](https://github.com/angular/angular.js) module to provide an shared synced object
througth multiple instance of browser by using [WAMP](http://wamp.ws/). Useful if you want to *near realtime* share information
between webapps. The wamp protocol is really great and can lead to use
 serverless centralized web application.  

# How to use ngSharedObject

## Get it
You can use bower to get the module :
```bash
$ bower install ng-shared-object --save
```
## Configure angular
Add `ngSharedObject` to your module :
```javascript
angular.module('modulename',[
  'ngSharedObject',
])
```

## Connect to a wamp server
Get a wamp router ([Crossbar](http://crossbar.io) for example) then 
init connection with the router :
```javascript
angular.config(function($wampProvider){
  $wampProvider.init {
      url: 'ws://your.domain.com:8787/ws'
      realm: "realm1"
      max_retries: 30
      initial_retry_delay: 2
    }
})
```
## Inject shared  in your controller

```javascript
angular.module('modulename').controller('TheCtrl', function(sharedObject){
  var master = true; //false for other client
   
  sharedObject.$init('the.prefix', master);
  
  $scope.so = sharedObject;
  
  // ... do what you want now ...
})
```

## Use it

Then you can use your object as usual and see modifications 
propagated over all browser connected to the same object.

# API
* **sharedObject.$init(prefix, master=False)** init the connection the object using the prefix 
as wamp channel namespace to avoid collisions. Master must be `true` for one 
* **sharedObject.$reset()** emptied the object.
* **sharedObject.$sync()** get all data from master. Useful in case of loosing sync.

# Warning
* The master has the truth. Changes can be rejected if the master value is different.
* Not really tested with more than 5 clients for now. Can have some race condition.
* The master must be configured before the other client.