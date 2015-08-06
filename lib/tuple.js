(function() {
  var Tuple;

  module.exports = Tuple = (function() {
    Tuple.isHash = function(data) {
      if (!data || data instanceof Array || typeof data !== 'object') {
        return false;
      }
      return true;
    };

    Tuple.DEFAULT = {
      expire: 300
    };

    function Tuple(data1) {
      this.data = data1;
      this.__defineSetter__('expire', function(sec) {
        return this.expire_at = Math.floor(Date.now() / 1000) + sec;
      });
      this.expire = 300;
    }

    Tuple.prototype.match = function(tuple) {
      var data, k, ref, v;
      if (!Tuple.isHash(tuple)) {
        return false;
      }
      data = tuple instanceof Tuple ? tuple.data : tuple;
      ref = this.data;
      for (k in ref) {
        v = ref[k];
        if (typeof v === 'object') {
          if (typeof data[k] !== 'object') {
            return false;
          }
          if (JSON.stringify(v) !== JSON.stringify(data[k])) {
            return false;
          }
        } else {
          if (v !== data[k]) {
            return false;
          }
        }
      }
      return true;
    };

    return Tuple;

  })();

}).call(this);
