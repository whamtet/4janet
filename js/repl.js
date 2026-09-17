
const $ = x => document.querySelector(x);
const $$ = x => Array.from(document.querySelectorAll(x));

let repl_input;
let initializing = true;
let tasks = [];
let taskIndex = 0;

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
    print: function(result) {
        if (!initializing) {
            const {solution, i} = tasks[taskIndex];
            if (solution) {
                // disp(result)
            } else {
                if ('"true"' === result) {
                    tasks[taskIndex].success = true;
                    pass(i);
                } else {
                    fail(i);
                }
            }
            taskIndex++;
            if (taskIndex < tasks.length) {
                const nextTask = tasks[taskIndex];
                repl_input(nextTask.toExecute);
            } else if (tasks.slice(1).every(x => x.success)) {
                // offer to move to next problem!
                $('#myModal').showModal();
            }
        }
    },
    printErr: function(text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        // dispError(text);
    },
    postRun: [function() {
        Module._repl_init()
        repl_input = Module.cwrap('repl_input', 'void', ['string']);
        initializing = false;
        submit()
    }],
};

function submit() {

    taskIndex = 0;
    tasks = [];

    const solution = $('#solution').innerText;
    tasks.push({solution});

    $$('.unit-test').forEach((el, i) => {
        const testCode = el.innerText;
        const toExecute = testCode.replaceAll('__', solution);
        tasks.push({toExecute, i});
    });

    repl_input(solution);
}
