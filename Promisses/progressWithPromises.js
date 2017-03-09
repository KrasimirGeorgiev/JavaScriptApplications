var windowLoadProgress = window.onload;
window.onload = function () {
    if (windowLoadProgress) {
        windowLoadProgress();
    }

    var loadingElement = document.getElementById('loading'),
        loadingWrapper = document.getElementById('loadingWrapper'),
        resultElement = document.getElementById('result'),
        index = 0;
    
    test().then(function (data) {
        console.log("Success: " + data);
        loadingWrapper.style.visibility = 'hidden';
        resultElement.innerHTML = data;
    }, function (error) {
        console.log("Error: " + error);
    }, function (progress) {
        index += 1;
        console.log("Progress: " + progress);
        loadingElement.style.width = index * 50 + 'px';
    });

    function test() {
        var deferred = Q.defer();

        for (var i = 0; i < 15; i++) {
            setTimeout(function () {
                deferred.notify(i);
            }, i * 1000);
        }

        setTimeout(function () {
            deferred.resolve('IMPORTANT INFORMATION!!!');
        }, 10000)

        return deferred.promise;
    }
};