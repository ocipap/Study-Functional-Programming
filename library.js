var users = [
  {id: 1, name: 'ID', age: 29},
  {id: 2, name: 'QW', age: 30},
  {id: 3, name: 'WE', age: 31},
  {id: 4, name: 'ER', age: 32},
  {id: 5, name: 'RT', age: 21},
  {id: 6, name: 'DF', age: 28},
  {id: 7, name: 'AS', age: 35},
  {id: 8, name: 'IS', age: 25}
]

const _each = (list, iter) => {
  for(var i = 0; i < list.length; i++) {
    iter(list[i])
  }
}

const _curry = (fn) => {
  return function (a, b) {
    return arguments.length == 2 ? fn(a,b) : b => fn(a, b)
  }
}

const _curryr = (fn) => {
  return function (a, b) {
    return arguments.length == 2 ? fn(a,b) : b => fn(b, a)
  }
}

const _filter = _curryr((list, predi) => {
  var new_list = []
  _each(list, (val) => {
    if(predi(val)) {
      new_list.push(val)
    }
  })
  return new_list
})

const _map = _curryr((list, mapper) => {
  var new_list = []
  _each(list, (val) => {
    new_list.push(mapper(val))
  })
  return new_list
})

const _get = _curryr((obj, key) => {
  return obj == null ? undefined : obj[key]
})

const _reduce = function(list, iter, memo) {
  if(arguments.length == 2) {
    [memo, ...list] = list
  }
  _each(list, (val) => {
    memo = iter(memo, val)
  })
  return memo
}

const _pipe = function() {
  var fns = arguments
  return function(arg) {
    return _reduce(fns, function(arg, fn){
      return fn(arg)
    }, arg)
  }
}

const _go = function() {
  [arg, ...fns] = arguments
  return _pipe.apply(null, fns)(arg)
}

/*
var slice = Array.prototype.slice

const _rest = function(list, num) {
  return slice.call(list, num || 1)
}

const _reduce2 = function(list, iter, memo) {
  if(arguments.length == 2) {
    memo = list[0]
    list = _rest(list)
  }
  _each(list, (val) => {
    memo = iter(memo, val)
  })
  return memo
} */

const add = _curry((a, b) => a + b)

const sub = _curryr((a, b) => a - b)

console.log(
  _map(
      _filter(users, function(user){ return user.age >= 30 }),
      _get("name")
  )
)


_go(users,
  function(users) {
    return _filter(users, function(user){ 
      return user.age >= 30 
    })
  },
  function(users) {
    return _map(users, _get("name"))
  },
  console.log
)

_go(users,
  _filter(user => user.age >= 30),
  _map(_get("name")),
  console.log)


