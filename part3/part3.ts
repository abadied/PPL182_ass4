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
        yield g1.next().value;
        yield g2.next().value;
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
    let arr = [];
    for(let i = 0 ; i < arrays.length ; i++){
        arr = arr.concat(flatten(arrays[i]));
        yield arr;
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

// const promise1 = new Promise(function(resolve, reject) {
//     setTimeout(resolve, 500, 'one');
// });
 
// const promise2 = new Promise(function(resolve, reject) {
//     setTimeout(resolve, 100, 'two');
// });
 
// race([promise1, promise2]).then(function(value) {
//   console.log(value);
//   // Both resolve, but promise2 is faster
// });

// console.log(take(interleave((x)=> reduce((x) =>  , (x)=> {if(x%2 != 0) return x}), 8));
console.log(take(interleave(flatten([[1], [[3]], 5]), cycle([2, 4, 6])), 8));
console.log(take(flatten([1, [2, [3]], 4, [[5, 6], 7, [[[8]]]]]),8 ))
console.log(take(cycle([1, 2, 3]), 8))



