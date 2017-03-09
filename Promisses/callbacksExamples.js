// 1
function asyncOperation(params, successCalback, errorCalback) {
    // DO SOMETHING
}

// 2
function asyncOperation(options) {
    var params = options.params;
    var success = options.success;
    // DO SOMETHING
}

asyncOperation({
    params: {},
    success: function (result) { },
});

// 3 NODE
function sumNumbersAsyncOPeration(params, callback) {
    // DO SOMETHING
    if (params && params.a > 0 && params.b > 0) {
        callback(null, params);
    } else {
        callback(new Error('Error in params'));
    }
}

function squareRootsSum(error, data) {
    if (error) { // err !== null
        // DO SOMETHING
        console.log(error);
    } else {
        // DO SOMETHING ELSE
        var sum = Math.sqrt(data.a) + Math.sqrt(data.b);
        console.log(sum);
    }
}

sumNumbersAsyncOPeration({ a: 12, b: -12 }, squareRootsSum);