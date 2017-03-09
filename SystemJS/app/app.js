// jquery
import 'jquery';
$('<h1/>')
    .text('system.js DEMO')
    .appendTo(document.body);

// db
import db from 'app/db.js';

// file1
import {file1Funk1, file1Funk2} from 'app/file1.js';


import file11 from 'app/file1.js';



function func1() {
    console.log('app.js func 1');
    db.add(4);
    db.add(8);
    db.add(1);
    db.add(6);
    console.log(db.all());
}

export function func2() {
    console.log('app.js func 2');
    db.deleteAll();
    console.log(db.all());
}

function func3() {
    console.log('app.js func 3');
    file1Funk1();
    file1Funk2();
    console.log('------------');
    console.log(file11.file1Funk3());
    console.log(file11.file1Funk4());
}

export {func1, func3}