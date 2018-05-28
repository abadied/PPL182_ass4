import * as assert from 'assert'
/*
 * From Mozilla Developer Network:
 * The Promise.race(promises) method returns a promise that resolves or rejects
 * as soon as one of the promises in the array resolves or rejects,
 * with the value or reason from that promise.
 */
function race(promises) {
    return Promise.race(promises);
}

/*
 * Write a function that takes an arbitrarily
 * nested array and generates the sequence
 * of values from the array.
 * Example: [...flatten([1, [2, [3]], 4, [[5, 6], 7, [[[8]]]]])] => [1, 2, 3, 4, 5, 6, 7, 8]
 */
function* flatten(array) {
    const [first, ...rest] = array;
  
  if (first instanceof Array && first.length) {
    yield* flatten(first);
  } else {
      if (!(first instanceof Array))
        yield first;
  }
  
  if (rest instanceof Array && rest.length) {
    yield* flatten(rest);
  }
}

/*
 * Given two generators, write a function
 * that generates the interleaved sequence
 * of elements of both generators.
 * Example: given generators for even and odd
 * numbers, take(interleave(evens(), odds()), 8) => [0, 1, 2, 3, 4, 5, 6, 7]
 */
function* interleave(g1, g2) {
    while(true){
        let  dic1 = g1.next();
        let dic2 = g2.next();
        if (dic1.done && dic2.done) {
            break;
        }else{
            if(!dic1.done) yield dic1.value;
            if(!dic2.done) yield dic2.value;
        }
    } 
}

/*
 * Write a function that continuously generates
 * elements of a given array in a cyclic manner.
 * Example: take(cycle([1, 2, 3]), 8) => [1, 2, 3, 1, 2, 3, 1, 2]
 */
function* cycle(array) {
    let i = 0;
    while(true){
        yield array[i%array.length];
        i++;
    }
}

/*
 * Write a function that returns
 * all elements from the first array,
 * then all elements from the next array, etc.
 * This function lets us to treat an array of arrays
 * as a single collection.
 * Example: [...chain([['A', 'B'], ['C', 'D']])] => ['A', 'B', 'C', 'D']
 */
function* chain(arrays) {
    let i = 0;
    while(i < arrays.length){
        let j = 0
        while (j < arrays[i].length){
            yield arrays[i][j];
            j++;
        }
        i++;
    }
}

/*
 * In order to make testing your generators easier,
 * the function take takes a generator g and a natural number n
 * and returns an array of the first n elements of g.
 * If g is exhausted before reaching n elements,
 * less than n elements are returned. 
 */
function take(g, n) {
    const result = [];
    for (let i = 0; i < n; i++) {
        const { value, done } = g.next();
        if (done) {
            break;
        }
        result.push(value);
    }
    return result;
}
 // TESTS --------------------------------------------------------------------------
const promise1 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, 'one');
});
 
const promise2 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, 'two');
});
 
race([promise1, promise2]).then(function(value) {
  console.log(value);
  // Both resolve, but promise2 is faster
});

//---------------------------------------------------------------------------------
//flatten
let f = [[1], [8,6,3,4], [[2]]];
let f1 = [[] , [1,5,6,7], [], [1,3],[]];
let f2 = [[[2],'ppl'], [true, {vlaue:'bye'}], [[[[[[5]]]]]]];

// assert.deepEqual([...flatten([1, [2, [3]], 4, [[5, 6], 7, [[[8]]]]])], [1,2,3,4,5,6,7,8]);
// assert.deepEqual([...flatten(f)], [1,8,6,3,4,2]);
// assert.deepEqual([...flatten(f1)], [1,5,6,7,1,3]);
// assert.deepEqual([...flatten(f2)], [ 2, 'ppl', true, { vlaue: 'bye' }, 5 ]);
assert.deepEqual(take(flatten(f), 2), [1,8]);
assert.deepEqual(take(flatten(f1), 5), [1,5,6,7,1]);
assert.deepEqual(take(flatten(f2), 2), [2,'ppl']);

//---------------------------------------------------------------------------------
//interleave....
function* evens(){
    var i = 0;
    while(true){
        yield i;
        i = i + 2;
    }
}

function* odds(){
    var i = 1;
    while(true){
        yield i;
        i = i + 2;
    }
}

function* evens1(){
    var i = 0;
    yield i;
    yield i + 2;
}

function* odds1(){
    var i = 1;
    yield i;
    yield i + 2;
}

function* evens2(){
    var i = 0;
    yield i;
}

function* odds2(){
    var i = 1;
    while(true){
        yield i;
        i = i + 2;
    }
}

assert.deepEqual(take(interleave(evens(), odds()), 8), [0,1,2,3,4,5,6,7]);
assert.deepEqual(take(interleave(evens1(), odds1()), 8), [0,1,2,3]);
assert.deepEqual(take(interleave(evens2(), odds2()), 8), [0,1,3,5,7,9,11,13]);

//-------------------------------------------------------------------------------------
//cyclic
assert.deepEqual((take(cycle([1, 2, 3]), 8)), [1,2,3,1,2,3,1,2]);
assert.deepEqual((take(cycle([1]), 5)), [1,1,1,1,1]);
assert.deepEqual((take(cycle([[1], 2,3,4,5,6]), 4)), [[1],2,3,4]);

//------------------------------------------------------------------------------------
//chian tests...

let c1 = [[{ofir:100, adi:100}, true, 'its funny'], [13,17,true,false,'black','white'],[[1,2,3], ['a','b','c'], 
            [{test:'looks OK', amothertest:'still ok'}, true]]];
// assert.deepEqual([...chain(c1)],[ { ofir: 100, adi: 100 },
//                                     true,
//                                     'its funny',
//                                     13,
//                                     17,
//                                     true,
//                                     false,
//                                     'black',
//                                     'white',
//                                     [ 1, 2, 3 ],
//                                     [ 'a', 'b', 'c' ],
//                                     [ { test: 'looks OK', amothertest: 'still ok' }, true ] ] );

let c2 = [['a','b'], ['c', 'd']];
assert.deepEqual([...chain(c2)], ['a', 'b', 'c', 'd']);

let c3 = [[], ['a', ['b']], [], ['c', 'd'], []];
// assert.deepEqual([...chain(c3)], ['a', ['b'],'c', 'd']);
assert.deepEqual(take(chain(c1), 1), [{ofir:100, adi:100}]);
assert.deepEqual(take(chain(c2), 2), ['a', 'b']);
assert.deepEqual(take(chain(c3), 2), ['a', ['b']]);


