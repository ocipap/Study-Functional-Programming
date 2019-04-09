const log = console.log

// curry
const curry = f =>
    (a, ..._) => _.length ? f(a, ..._) : (..._) =>  f(a, ..._)

// infinity
function *infinity(i = 0) {
    while(1) yield i++
}

// map
const map = curry((f, iter) => go(L.map(f, iter), takeAll))

// filter
const filter = curry((f, iter) => go(L.filter(f, iter), takeAll))

// reduce
const reduce = curry((f, acc ,iter) => {
    if(!iter) {
        iter = acc[Symbol.iterator]()
        acc = iter.next().value
    }
    for(const a of iter) {
        acc = f(acc, a)
    }
    return acc
})

// go
const go = (...args) => reduce((a, f) => f(a), args)

// pipe
const pipe = (f, ...fs) => (...args) => go(f(...args), ...fs)

// take
const take = curry((l, iter) => {
    let res = []
    for(const a of iter) {
        res.push(a)
        if(res.length === l) return res
    }
    return res
})

// takeAll
const takeAll = take(infinity)

// range
const range = l => {
    let i = -1
    let res = []
    while(++i < l) {
        res.push(i)
    }
    return res
}

// join
const join = curry((sep = ",", iter) => reduce((a,b) => `${a}${sep}${b}`, iter))

// find
const find = (f, iter) => go(iter, 
    L.filter(f), 
    take(1), 
    ([k]) => k)


// isIterable
const isIterable = (iter) => iter && iter[Symbol.iterator]

const flatten = (iter) => go(L.flatten(iter), takeAll)

const deepFlat = (iter) => go(L.deepFlat(iter), takeAll)

// 지연 평가
const L = {}

// ㅣ.range
L.range = function *(l) {
    let i = -1
    while (++i < l) yield i
}

// L.map
L.map = curry(function *(f, iter) {
    for(const a of iter) {
        yield f(a)
    }
})

// L.filter
L.filter = curry(function *(f, iter) {
    for(const a of iter) {
        if(f(a)) yield a
    }
})

// L.entries
L.entries = function *(obj) {
    for(const k in obj) yield [k, obj[k]]
}

// L.flatten
L.flatten = function *(iter) {
    for(const a of iter) {
        if(isIterable(a)) yield* a
        else yield a
    }
}

L.deepFlat = function *f(iter) {
    for(const a of iter) {
        if(isIterable(a)) yield* f(a)
        else yield a
    }
}
    




