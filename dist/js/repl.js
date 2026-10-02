
const $ = x => document.querySelector(x);
const $$ = x => Array.from(document.querySelectorAll(x));
const show = x => $(x).classList.remove('hidden');
const hide = x => $(x).classList.add('hidden');

let repl_input, repl_prompt;
let initializing = true;
let tasks = [];
let taskIndex = 0;

function repl_input2(s) {
    repl_input(s + '\n')
}

function fail(i) {
    show('#fail' + i)
    hide('#pass' + i);
}
function pass(i) {
    show('#pass' + i);
    hide('#fail' + i);
}

const dispEl = $('#disp');
const dispErrorEl = $('#disp-error');

function disp(result) {
    dispEl.classList.remove('hidden');
    dispEl.innerText = result;
    dispErrorEl.classList.add('hidden');
}

function dispError(result) {
    dispEl.classList.add('hidden');
    dispErrorEl.classList.remove('hidden');
    dispErrorEl.innerText = result;
}

// Module is later fully initialized by janet.js
window.Module = {
    preRun: [],
    print: function(result) {
        if (arguments.length > 1) result = Array.prototype.slice.call(arguments).join(' ');
        if (!initializing) {
            const {solution, i} = tasks[taskIndex];
            if (solution) {
                disp(result)
            } else {
                if ('true' === result) {
                    tasks[taskIndex].success = true;
                    pass(i);
                } else {
                    fail(i);
                }
            }
            taskIndex++;
            if (taskIndex < tasks.length) {
                const nextTask = tasks[taskIndex];
                setTimeout(() => repl_input2(nextTask.toExecute), 0);
            } else if (tasks.slice(1).every(x => x.success)) {
                // offer to move to next problem!
                $('#myModal').showModal();
            }
        }
    },
    printErr: function(text) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
        console.error(text);
        dispError(text);
    },
    postRun: [function() {
        Module._repl_init()
        repl_input = Module.cwrap('repl_input', 'void', ['string']);
        repl_prompt = Module.cwrap('repl_prompt', 'string', []);
        initializing = false;
    }],
};

function submit() {

    taskIndex = 0;
    tasks = [];

    const solution = $('#solution').innerText.trim();
    tasks.push({solution});

    $$('.unit-test').forEach((el, i) => {
        const testCode = el.innerText;
        const toExecute = testCode.replaceAll('__', solution).trim();
        tasks.push({toExecute, i});
    });

    repl_input2(solution);
}
