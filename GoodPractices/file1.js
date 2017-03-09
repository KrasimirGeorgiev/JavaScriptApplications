// file 1
var oldWindowOnLoadFile1 = window.onload;
window.onload = function () {
    if (oldWindowOnLoadFile1) {
        oldWindowOnLoadFile1();
    }

    console.log('file1');
}