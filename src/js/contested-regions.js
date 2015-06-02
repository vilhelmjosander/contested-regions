var Regions = (function(root, undefined) {
  "use strict";
  // Private
  var _this;
  var toArray = Array.prototype.slice;
  var defaults = {
    version: '0.1'
  };
  var listener = window.addEventListener || window.attachEvent;

  function init(opts) {

    // Return if on IE
    if('attachEvent' in window) {
      return false;
    }

    _this = this;
    _this.elems = {
      containers: [],
      movers: []
    };
    opts = opts || {};
    var options = helpers.extend(defaults, opts);

    addListeners();
  };

  function addListeners() {
    // Listen
    listener('DOMContentLoaded', setElems);
    listener('resize', resizeHandler);
  }

  function setElems() {
    var nodeList = toArray.call( document.querySelectorAll('[region-container], [region-flow-into]') ) || [];
    for(var i in nodeList) {

      var node = nodeList[i];
      var attrs = [];
      // Loop through attributes of node and store in key-value
      toArray.call(node.attributes).forEach(function(attr) {
        attrs[attr.name] = attr.value;
      });

      if ( typeof attrs['region-flow-into'] === 'undefined' ) {
        _this.elems['containers'][ attrs['region-container'] ] = node;
      } else {
        _this.elems['movers'].push({
          node:             node,
          breakPoint:       attrs['region-breakpoint'],
          flowInto:         attrs['region-flow-into'],
          isMoved:          false,
          origPrevSibling:  node.previousElementSibling,
          origParent:       node.parentNode,
          priority:         i
        });
      }
    }
    // Set init positions
    resizeHandler();
  };

  function resizeHandler() {
    var elems = _this.elems['movers'];
    var width = window.innerWidth;
    var containers = _this.elems['containers']

    for(var i in elems) {
      var elem = elems[i];
      var breakPoint = parseInt( elem.breakPoint, 10);

      if( !elem.isMoved && width <= breakPoint ) {
        elem.isMoved = true;
        helpers.appendChild(containers[elem.flowInto], elem.node);

      } else if( elem.isMoved && width > breakPoint ) {
        elem.isMoved = false;
        if(elem.origPrevSibling) {
          helpers.insertAfter(elem.origPrevSibling, elem.node);
        } else {
          helpers.prependChild(elem.origParent, elem.node);
        }
      }
    }
  }

  // Helpers
  var helpers = {
    /*
    * Extends orig obj with ext obj - shallow copy
    */
    extend: function(orig, ext) {
      if(typeof orig !== 'object' || typeof ext !== 'object')
        throw new Error('Can only extend objects');

      for(var key in ext) {
        orig[key] = ext[key];
      }
      return orig;
    },
    /*
    * Append newNode into referenceNode
    */
    appendChild: function(referenceNode, newNode) {
      referenceNode.appendChild(newNode);
    },

    /*
    * Perpend newNode into referenceNode
    */
    prependChild: function(referenceNode, newNode) {
        referenceNode.insertBefore( newNode, referenceNode.firstChild);
    },

    /*
    * Insert newNode after referenceNode
    */
    insertAfter: function(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },
    /*
    * Checks whether a given node still exists in the DOM
    */
    stillExistsInDom: function(node) {
        return document.documentElement.contains(node);
    }
  };

  // Public
  return {
    init: init
  }

})(window);