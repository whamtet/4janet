
const $ = x => document.querySelector(x);
const $$ = x => Array.from(document.querySelectorAll(x));

let repl_input;
const booleanSym = 'boolean' + Math.random().toString().substring(2);
let showPrint = false;

function fail(i) {
    $('#fail' + i).classList.remove('hidden');
    $('#pass' + i).classList.add('hidden');
}
function pass(i) {
    $('#pass' + i).classList.remove('hidden');
    $('#fail' + i).classList.add('hidden');
}

// Module is later fully initialized by janet.js
window.Module = {
    print: function(x) {
        if (showPrint) {
            Array.from(x).forEach(function(c, i) {
                if (0 < i && i < x.length - 1) {
                    if (c === 't') {
                        pass(i - 1)
                    } else {
                        fail(i - 1);
                    }
                }
            })
            if (x && !x.includes('f')) {
                $('#myModal').showModal();
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
        repl_input(`(defn ${booleanSym} [x] (if x "t" "f"))`);
        showPrint = true;
    }],
};

function submit() {
    const unitTests = $$('.unit-test').map(x => x.innerText).join(' ');
    const solution = $('#solution').innerText;

    const substituted = unitTests.replaceAll('__', solution);
    console.log('substituted ' + substituted);
    repl_input(`(->> [${substituted}] (map ${booleanSym}) string/join)`);
}

setTimeout(submit, 500);
