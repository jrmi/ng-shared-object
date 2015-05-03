'use strict'

angular.module('ngSharedObject', ['vxWamp'])
.factory 'sharedObject', ['$rootScope', '$log', '$q', '$wamp', '$timeout',
  ($rootScope, $log, $q, $wamp, $timeout) ->
    _master = false
    _debounce = null
    _prefix = ''

    _last$context = {}
    _change = ()->

      # Send signal to all other (only called by master)
    propagateChanges = (key, newValue, oldValue) ->
      $log.debug("Propagating change...")
      $wamp.publish _prefix + 'context.newValue', [key, newValue, oldValue]

    # Call master to change value
    askForChanges = (key, newValue, oldValue) ->
      defer = $q.defer()
      $log.debug("Ask change to master...")
      $wamp.call(_prefix + 'context.changeValue', [key, newValue, oldValue]).then (resp)->
        if !resp.success
          $log.info('Change failed. Reverting...')
          defer.reject()
          $context[key] = resp.data
          _last$context[key] = angular.copy(resp.data)
        else
          $log.debug('Change Success')
          propagateChanges(key, newValue, oldValue)
          defer.resolve()

      return defer.$promise


    $context = {
      $reset: () ->
        for k, _ of $context
          '$' == k[0] || delete $context[k]

      $sync: () ->
        $wamp.call(_prefix + 'context.all', []).then (context)->
          $log.debug('Ask all data')
          angular.extend($context, context)
          _last$context = angular.copy($context)

      $init: (prefix, master = false) ->
        _prefix = prefix
        _master = master

        if master
          $wamp.register _prefix + 'context.changeValue', (args) ->
            [key, newValue, oldValue] = args
            $log.debug('Change asked')
            if !angular.equals($context[key], oldValue) and $context[key] != undefined
              $log.info('Change canceled')
              return {success: false, data: $context[key]}
            else
              $log.debug('Change accepted')
              $context[key] = newValue
              return {success: true}

          $wamp.register _prefix + 'context.all', (args) ->
            $log.debug('Send all data')
            return $context

          _change = propagateChanges
        else
          _change = askForChanges
          @$sync()

        # Listener for new Value propagated from master
        $wamp.subscribe _prefix + 'context.newValue', (args) ->
          $log.info('Change propagated')
          [key, newValue, oldValue] = args
          $context[key] = newValue
          _last$context[key] = angular.copy(newValue)
    }

    $rootScope.$watch () ->
      _debounce || (_debounce = $timeout () ->
        _debounce = null

        if !angular.equals($context, _last$context)
          for k, v of $context
            if '$' != k[0] and !angular.equals($context[k], _last$context[k])
              _change(k, v, _last$context[k])

          _last$context = angular.copy($context)

      , 1000)

    return $context
]