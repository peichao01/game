/*!
 * jQuery Tiny Pub/Sub - v0.6 - 1/10/2011
 * http://benalman.com/ see https://gist.github.com/661855
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 *
 * (removed pre 1.4.3 support, added $.pubsubdebug())
 */

(function($){

  // object on which to bind, unbind and trigger handlers. reqs jQuery 1.4.3+
  var o = $({});

  // Subscribe to a topic. Works just like bind, except the passed handler
  // is wrapped in a function so that the event object can be stripped out.
  // Even though the event object might be useful, it is unnecessary and
  // will only complicate things in the future should the user decide to move
  // to a non-$.event-based pub/sub implementation.
  $.subscribe = function(topic, fn) {

    // Call fn, stripping out the 1st argument (the event object)
    function wrapper() {
      return fn.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    // Add .guid property to function to allow it to be easily unbound
    // reqs jQuery 1.4+
    wrapper.guid = fn.guid = fn.guid || $.guid++;

    // Bind the handler.
    o.bind(topic, wrapper);
  };

  // Unsubscribe from a topic. Works exactly like unbind
  $.unsubscribe = function() {
    o.unbind.apply(o, arguments);
  };

  // Publish a topic. Works exactly like trigger
  $.publish = function() {
    o.trigger.apply(o, arguments);
  };
  
  // for debugging
  $.pubsubdebug = function() {
    return o;
  };

})(jQuery);