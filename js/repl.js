
const $ = x => document.querySelector(x);
const $$ = x => Array.from(document.querySelectorAll(x));

let repl_input;
let showPrint = false;
let testsToRun = [];
let results = [];

function fail(i) {
    $('#fail' + i).classList.remove('hidden');
    $('#pass' + i).classList.add('hidden');
}
function pass(i) {
    $('#pass' + i).classList.remove('hidden');
    $('#fail' + i).classList.add('hidden');
}

function runTest() {
    const solution = $('#solution').innerText;

    const testEl = testsToRun[0];
    const toRun = testEl.innerText.replaceAll('__', solution);
    const index = testEl.dataset.index;
    repl_input(`(string (if ${toRun} "t" "f") ${index})`);
}

// Module is later fully initialized by janet.js
window.Module = {
    print: function(x) {
        x = x.substring(1, x.length - 1);
        if (showPrint) {
            if (x.startsWith('t')) {
                pass(x.substring(1));
                results.push(true);
            } else {
                fail(x.substring(1));
                results.push(false);
            }
            testsToRun = testsToRun.slice(1);
            if (testsToRun.length) {
                runTest();
            } else {
                if (results.length && results.every(x => x)) {
                    $('#myModal').showModal();
                }
            }

        } else {
            console.log(x);
        }
    },
    printErr: function(text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        console.error(text);
    },
    postRun: [function() {
        Module._repl_init()
        repl_input = Module.cwrap('repl_input', 'void', ['string']);
        showPrint = true;
        submit()
    }],
};

function submit() {

    testsToRun = $$('.unit-test');
    results = [];

    if (testsToRun.length) {
        runTest();
    }
}
