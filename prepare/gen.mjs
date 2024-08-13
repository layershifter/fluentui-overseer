function generatorToAsync(gen) {
    return () => new Promise(function(resolve, reject) {
        function step(iterator, nextValue) {
            const { done, value } = iterator.next(nextValue);
    
            if (done) {
                resolve(value);
            } else {
                Promise.resolve(value).then(
                    resolvedValue => step(iterator, resolvedValue),
                    reject
                );
            }
        }
    
        step(gen());
    })
}

const asyncFunction = generatorToAsync(function* () {
    const a = yield 111;
    const b = yield new Promise(resolve => setTimeout(() => resolve(222), 100));

    return a + b;
});

const asyncFunction2 = async function () {
    const a = await 111;
    const b = await new Promise(resolve => setTimeout(() => resolve(222), 100));

    return a + b;
}

asyncFunction().then(
    ret => console.log('OK', ret),
    err => console.error('ERR', err)
);
asyncFunction2().then(
    ret => console.log('OK', ret),
    err => console.error('ERR', err)
);
