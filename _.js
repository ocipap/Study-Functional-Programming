// curry
var _curry = (fn) => {
  return function (a, b) {
    return arguments.length == 2 ? fn(a,b) : b => fn(a, b)
  }
}

// curryr
var _curryr = (fn) => {
  return function (a, b) {
    return arguments.length == 2 ? fn(a,b) : b => fn(b, a)
  }
}

// get
var _get = _curryr((obj, key) => {
  return obj == null ? undefined : obj[key]
})

// filter
var _filter = _curryr((list, predi) => {
  var new_list = []
  _each(list, (val) => {
    if(predi(val)) {
      new_list.push(val)
    }
  })
  return new_list
})

// map
var _map = _curryr((list, mapper) => {
  var new_list = []
  _each(list, (val, key) => {
    new_list.push(mapper(val, key))
  })
  return new_list
})

// is_object
var _is_object = (obj) => {
  return typeof(obj) == "object" && !!obj
}

// keys
var _keys = (obj) => {
  return _is_object(obj) ? Object.keys(obj) : []
}

// length
var _length = _get("length")

// each
var _each = (list, iter) => {
  var keys = _keys(list)
  for(var i = 0, len = keys.length ; i < len; i++) {
    iter(list[keys[i]], keys[i])
  }
}

// reduce
var _reduce = function(list, iter, memo) {
  if(arguments.length == 2) {
    [memo, ...list] = list
  }
  _each(list, (val) => {
    memo = iter(memo, val)
  })
  return memo
}

// pipe
var _pipe = function() {
  var fns = arguments
  return function(arg) {
    return _reduce(fns, function(arg, fn){
      return fn(arg)
    }, arg)
  }
}

// go
var _go = function() {
  [arg, ...fns] = arguments
  return _pipe.apply(null, fns)(arg)
}

// values
var _values = _map(_identity)

// identity
function _identity(val) {
  return  val
}

// plunk
var _plunk = (data, key) => {
  return _map(data, _get(key))
}

// reject
var _reject = _curryr((data, predi) => {
  return _filter(data, _nagate(predi))
})

// nagate
var _nagate = (func) => {
  return function(val) {
    return !func(val)
  }
}

// compact
var _compact = _filter(_identity)

// find
var _find = _curryr((list, predi) => {
  var keys = _keys(list)
  for(var i = 0, len = keys.length ; i < len; i++) {
    var val = list[keys[i]]
    if(predi(val)) return val
  }
})

// find index
var _find_index = _curryr((list, predi) => {
  var keys = _keys(list)
  for(var i = 0, len = keys.length ; i < len; i++) {
    if(predi(list[keys[i]])) return i
  }
  return -1
})

// some
var _some = (data, predi) => {
  return _find_index(data, predi || _identity) != -1
}

// every
var _every = (data, predi) => {
  return _find_index(data, _nagate(predi || _identity)) == -1
}

// min
var _min = (data) => {
  return _reduce(data, (a, b) => {
    return a < b ? a : b 
  })
}

// max
var _max = (data) => {
  return _reduce(data, (a, b) => {
    return a > b ? a : b 
  })
}

// min_by
var _min_by = _curryr((data, iter) => {
  return _reduce(data, (a, b) => {
    return iter(a) < iter(b) ? a : b 
  })
})

// max_by
var _max_by = _curryr((data, iter) => {
  return _reduce(data, (a, b) => {
    return iter(a) > iter(b) ? a : b 
  })
})

// push
var _push = (obj, key, val) => {
  (obj[key] = obj[key] || []).push(val)
  return obj
}

// group_by
var _group_by = _curryr((data, iter) => {
  return _reduce(data, (grouped, val) => {
    return _push(grouped, iter(val), val)
  } ,{})
})

// inc
var _inc = (count, key) => {
  count[key] ? count[key]++ : count[key] = 1
  return count
}

// count_by
var _count_by = _curryr((data, iter)=> {
  return _reduce(data, (count, val) => {
    return _inc(count, iter(val))
  }, {})
})



