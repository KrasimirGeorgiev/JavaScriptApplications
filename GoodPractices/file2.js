// file 2
var oldWindowOnLoadFile2 = window.onload;
window.onload = function () {
    if (oldWindowOnLoadFile2) {
        oldWindowOnLoadFile2();
    }

    console.log('file2');
}