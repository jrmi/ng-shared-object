(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name jeuMobileApp.controller:MainCtrl
    * @description
    * context
    * Controller of the jeuMobileApp
   */
  angular.module('ngSharedObject', ['vxWamp']).factory('sharedObject', [
    '$rootScope', '$log', '$q', '$wamp', '$timeout', function($rootScope, $log, $q, $wamp, $timeout) {
      var $context, askForChanges, propagateChanges, _change, _debounce, _last$context, _master, _prefix;
      _master = false;
      _debounce = null;
      _prefix = '';
      _last$context = {};
      _change = function() {};
      propagateChanges = function(key, newValue, oldValue) {
        $log.debug("Propagating change...");
        return $wamp.publish(_prefix + 'context.newValue', [key, newValue, oldValue]);
      };
      askForChanges = function(key, newValue, oldValue) {
        var defer;
        defer = $q.defer();
        $log.debug("Ask change to master...");
        $wamp.call(_prefix + 'context.changeValue', [key, newValue, oldValue]).then(function(resp) {
          if (!resp.success) {
            $log.info('Change failed. Reverting...');
            defer.reject();
            $context[key] = resp.data;
            return _last$context[key] = angular.copy(resp.data);
          } else {
            $log.debug('Change Success');
            propagateChanges(key, newValue, oldValue);
            return defer.resolve();
          }
        });
        return defer.$promise;
      };
      $context = {
        $reset: function() {
          var k, _, _results;
          _results = [];
          for (k in $context) {
            _ = $context[k];
            _results.push('$' === k[0] || delete $context[k]);
          }
          return _results;
        },
        $sync: function() {
          return $wamp.call(_prefix + 'context.all', []).then(function(context) {
            $log.debug('Ask all data');
            angular.extend($context, context);
            return _last$context = angular.copy($context);
          });
        },
        $init: function(prefix, master) {
          if (master == null) {
            master = false;
          }
          _prefix = prefix;
          _master = master;
          if (master) {
            $wamp.register(_prefix + 'context.changeValue', function(args) {
              var key, newValue, oldValue;
              key = args[0], newValue = args[1], oldValue = args[2];
              $log.debug('Change asked');
              if (!angular.equals($context[key], oldValue) && $context[key] !== void 0) {
                $log.info('Change canceled');
                return {
                  success: false,
                  data: $context[key]
                };
              } else {
                $log.debug('Change accepted');
                $context[key] = newValue;
                return {
                  success: true
                };
              }
            });
            $wamp.register(_prefix + 'context.all', function(args) {
              $log.debug('Send all data');
              return $context;
            });
            _change = propagateChanges;
          } else {
            _change = askForChanges;
            this.$sync();
          }
          return $wamp.subscribe(_prefix + 'context.newValue', function(args) {
            var key, newValue, oldValue;
            $log.info('Change propagated');
            key = args[0], newValue = args[1], oldValue = args[2];
            $context[key] = newValue;
            return _last$context[key] = angular.copy(newValue);
          });
        }
      };
      $rootScope.$watch(function() {
        return _debounce || (_debounce = $timeout(function() {
          var k, v;
          _debounce = null;
          if (!angular.equals($context, _last$context)) {
            for (k in $context) {
              v = $context[k];
              if ('$' !== k[0] && !angular.equals($context[k], _last$context[k])) {
                _change(k, v, _last$context[k]);
              }
            }
            return _last$context = angular.copy($context);
          }
        }, 1000));
      });
      return $context;
    }
  ]);

}).call(this);
