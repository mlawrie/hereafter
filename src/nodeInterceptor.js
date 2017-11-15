var outstandingRequests = [];
var lastRequestId = 0;

var getRequestId = function() {
  lastRequestId += 1;
  return lastRequestId;
}

var monkeyPatchImpl = function(original, protocol) {
  return function(options, callback){
    
    var requestId = getRequestId();
    outstandingRequests.push(requestId);
    
    var markComplete = function() {
      if (outstandingRequests.indexOf(requestId) !== -1) {
        outstandingRequests.splice(outstandingRequests.indexOf(requestId), 1);
      }
    };
    
    try {
      return original.call(protocol, options, function(res) {
        res.on('end', markComplete);
        if (typeof callback === 'function') {
          callback(res);
        }
      }).on('error', markComplete)
        .on('abort', markComplete);
    } catch (e) {
      markComplete();
      throw e;
    }
  };
};

var applyMonkeyPatch = function(protocol) {
  var originalGet = protocol.get;
  protocol.get = monkeyPatchImpl(originalGet, protocol);

  var originalRequest = protocol.request;
  protocol.request = monkeyPatchImpl(originalRequest, protocol);
};

applyMonkeyPatch(require('http'));

module.exports = {
  getOutstandingRequestCount: function() {
    return outstandingRequests.length;
  }
};