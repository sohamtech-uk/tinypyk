import type { Lesson } from '../types/lesson';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const next = (content: string) => content ? '<next>' + content + '</next>' : '';
const say = (message: string, following = '') =>
  '<block type="say_message"><field name="MESSAGE">' + escapeXml(message) +
  '</field>' + next(following) + '</block>';
const ask = (question: string, variable: string, following = '') =>
  '<block type="ask_question"><field name="QUESTION">' + escapeXml(question) +
  '</field><field name="VAR" id="' + variable + '-id">' + variable +
  '</field>' + next(following) + '</block>';
const printVariable = (variable: string, following = '') =>
  '<block type="text_print"><value name="TEXT"><block type="variables_get">' +
  '<field name="VAR" id="' + variable + '-id">' + variable +
  '</field></block></value>' + next(following) + '</block>';
const compareText = (variable: string, expected: string) =>
  '<block type="logic_compare"><field name="OP">EQ</field>' +
  '<value name="A"><block type="variables_get"><field name="VAR" id="' +
  variable + '-id">' + variable + '</field></block></value>' +
  '<value name="B"><block type="text"><field name="TEXT">' +
  escapeXml(expected) + '</field></block></value></block>';
const choose = (variable: string, expected: string, yes: string, no: string, following = '') =>
  '<block type="control_if_else"><value name="IF">' +
  compareText(variable, expected) + '</value>' +
  '<statement name="DO">' + say(yes) + '</statement>' +
  '<statement name="ELSE">' + say(no) + '</statement>' +
  next(following) + '</block>';
const repeat = (times: number, message: string, following = '') =>
  '<block type="controls_repeat_ext"><value name="TIMES">' +
  '<shadow type="math_number"><field name="NUM">' + times +
  '</field></shadow></value><statement name="DO">' + say(message) +
  '</statement>' + next(following) + '</block>';
const simpleFunction = (name: string, message: string, following = '') =>
  '<block type="function_define_simple"><field name="NAME">' + name +
  '</field><statement name="DO">' + say(message) +
  '</statement>' + next(following) + '</block>';
const call = (name: string, following = '') =>
  '<block type="function_call_simple"><field name="NAME">' + name +
  '</field>' + next(following) + '</block>';
const parameterFunction = (name: string, parameter: string, following = '') =>
  '<block type="function_define_with_parameter">' +
  '<field name="NAME">' + name + '</field>' +
  '<field name="PARAM">' + parameter + '</field>' +
  '<statement name="DO"><block type="text_print"><value name="TEXT">' +
  '<block type="function_parameter"><field name="NAME">' + parameter +
  '</field></block></value></block></statement>' +
  next(following) + '</block>';
const callWith = (name: string, argument: string, following = '') =>
  '<block type="function_call_with_argument"><field name="NAME">' + name +
  '</field><value name="ARGUMENT"><block type="text"><field name="TEXT">' +
  escapeXml(argument) + '</field></block></value>' + next(following) + '</block>';
const start = (content: string, names: string[] = []) =>
  '<xml xmlns="https://developers.google.com/blockly/xml">' +
  (names.length ? '<variables>' + names.map((name) =>
    '<variable id="' + name + '-id">' + name + '</variable>').join('') +
    '</variables>' : '') +
  '<block type="start_program" x="24" y="24">' + next(content) +
  '</block></xml>';


// Optional bonus missions reuse the same Blockly workspace; these helpers only
// build starter XML and do not change saved projects or certificate requirements.
const numberBlock = (number: number) =>
  '<block type="math_number"><field name="NUM">' + number + '</field></block>';
const variableBlock = (variable: string) =>
  '<block type="variables_get"><field name="VAR" id="' + variable +
  '-id">' + variable + '</field></block>';
const plusValues = (left: string, right: string) =>
  '<block type="math_arithmetic"><field name="OP">ADD</field>' +
  '<value name="A">' + left + '</value><value name="B">' + right + '</value></block>';
const returnNumber = (number: number) =>
  '<block type="function_return_value"><value name="VALUE">' +
  numberBlock(number) + '</value></block>';
const setVariable = (variable: string, value: string, following = '') =>
  '<block type="variables_set"><field name="VAR" id="' + variable +
  '-id">' + variable + '</field><value name="VALUE">' + value +
  '</value>' + next(following) + '</block>';
const returnedCall = (name: string, argument?: string) =>
  argument === undefined
    ? '<block type="function_call_result_simple"><field name="NAME">' +
      name + '</field></block>'
    : '<block type="function_call_with_result"><field name="NAME">' +
      name + '</field><value name="ARGUMENT"><block type="text"><field name="TEXT">' +
      escapeXml(argument) + '</field></block></value></block>';

const treasureFunction = (following: string) =>
  '<block type="function_define_with_parameter">' +
  '<field name="NAME">collect_treasure</field><field name="PARAM">item</field>' +
  '<statement name="DO"><block type="text_print"><value name="TEXT">' +
  '<block type="function_parameter"><field name="NAME">item</field></block></value>' +
  next(returnNumber(5)) + '</block></statement>' + next(following) + '</block>';
const treasureStarter = start(treasureFunction(
  setVariable('stars', numberBlock(0),
    setVariable('stars', plusValues(variableBlock('stars'), returnedCall('collect_treasure', 'Moon rock')),
      setVariable('stars', plusValues(variableBlock('stars'), returnedCall('collect_treasure', 'Alien crystal')),
        printVariable('stars'))))), ['stars']);

const quizChoice = (variable: string) =>
  '<block type="control_if_else"><value name="IF">' +
  compareText(variable, 'Mars') + '</value>' +
  '<statement name="DO">' + returnNumber(10) + '</statement>' +
  '<statement name="ELSE">' + returnNumber(0) + '</statement></block>';
const quizFunction = (following: string) =>
  '<block type="function_define_simple"><field name="NAME">alien_quiz</field>' +
  '<statement name="DO">' +
  ask('Which is the Red Planet? ', 'answer', quizChoice('answer')) +
  '</statement>' + next(following) + '</block>';
const quizStarter = start(quizFunction(
  setVariable('stars', returnedCall('alien_quiz'), printVariable('stars'))),
['answer', 'stars']);

export const spaceExplorerProjectId = 'space-final-project';
export const spaceExplorerModules = [
  {
    id: 'space-module-1', label: 'Module 1', title: 'Space Cadet',
    subtitle: 'Learn Python basics, one launch step at a time.',
    topics: 'print · input · variables · if/else · loops',
    lessonIds: ['space-m1-1', 'space-m1-2', 'space-m1-3', 'space-m1-4'],
  },
  {
    id: 'space-module-2', label: 'Module 2', title: 'Mission Commander',
    subtitle: 'Reuse clever code with functions and parameters.',
    topics: 'def · call · reusable code · parameters',
    lessonIds: ['space-m2-1', 'space-m2-2', 'space-m2-3', 'space-m2-4'],
  },
];

export const spaceExplorerLessons: Lesson[] = [
  {
    id: 'space-m1-1', module: 'Space Explorer · Module 1',
    title: '1 · Hello, Explorer!', goal: 'Show your first space message.',
    concept: 'print()', level: 'Start', duration: '5 min',
    mission: 'Make mission control greet your space crew.',
    instructions: 'Change the greeting, press Play, and read the Python beside your blocks.',
    successCriteria: 'Your message appears in the output and Python uses print().',
    hint: 'A message block becomes print("your words") in Python.',
    steps: ['Find the Looks message block.', 'Write your own space greeting.', 'Press Play and read the output.'],
    vocabulary: ['print', 'text', 'output'],
    projectIdea: 'Welcome a robot, a comet, or a friendly alien.',
    starterXml: start(say('Welcome aboard, Space Explorer!')),
  },
  {
    id: 'space-m1-2', module: 'Space Explorer · Module 1',
    title: '2 · Meet Your Astronaut', goal: 'Ask a question and remember the answer.',
    concept: 'input() and variables', level: 'Start', duration: '8 min',
    mission: 'Ask for an invented astronaut nickname, then print it.',
    instructions: 'Run the program, enter a made-up nickname, and find where Python stores the reply.',
    successCriteria: 'The input box opens and the entered nickname appears in the output.',
    hint: 'input() waits for an answer; the variable keeps it for later.',
    steps: ['Ask for an astronaut nickname.', 'Print the saved answer.', 'Try two invented names.'],
    vocabulary: ['input', 'variable', 'answer'],
    projectIdea: 'Invent a robot name. Never enter personal details.',
    starterXml: start(ask('Choose an astronaut nickname: ', 'explorer', printVariable('explorer')), ['explorer']),
  },
  {
    id: 'space-m1-3', module: 'Space Explorer · Module 1',
    title: '3 · Choose Your Planet', goal: 'Let Python make a choice.',
    concept: 'if and else', level: 'Build', duration: '10 min',
    mission: 'Pack a rover for Mars and a telescope for other planets.',
    instructions: 'Type Mars, run, then type Jupiter and run again. Watch how the choice changes.',
    successCriteria: 'The program asks a question and uses if/else to choose equipment.',
    hint: 'Python checks planet == "Mars". A different answer takes the else route.',
    steps: ['Ask for a planet.', 'Check for Mars using if.', 'Add an else choice and test both routes.'],
    vocabulary: ['if', 'else', 'compare'],
    projectIdea: 'Change the planets and equipment to invent a new route.',
    starterXml: start(ask('Mars or Jupiter? ', 'planet',
      choose('planet', 'Mars', 'Pack the rover!', 'Pack the telescope!')), ['planet']),
  },
  {
    id: 'space-m1-4', module: 'Space Explorer · Module 1',
    title: '4 · Countdown to Launch', goal: 'Make actions repeat.',
    concept: 'repeat and loops', level: 'Build', duration: '8 min',
    mission: 'Perform three launch checks and blast off!',
    instructions: 'Try the repeat block. Count the output messages and change the repeats.',
    successCriteria: 'A loop repeats a message and the launch announcement appears afterwards.',
    hint: 'A repeat block becomes a Python for loop. Change 3 to 5 and test.',
    steps: ['Repeat a launch check three times.', 'Say Blast off afterwards.', 'Try a new repeat count.'],
    vocabulary: ['loop', 'repeat', 'count'],
    projectIdea: 'Write an astronaut checklist that repeats.',
    starterXml: start(repeat(3, 'Launch check!', say('Blast off!'))),
  },
  {
    id: 'space-m2-1', module: 'Space Explorer · Module 2',
    title: '5 · Meet Functions', goal: 'Create a named reusable action.',
    concept: 'def and call', level: 'Build', duration: '9 min',
    mission: 'Define launch(), then run it when the crew is ready.',
    instructions: 'Open My Blocks. Define gives a function its job; call runs it.',
    successCriteria: 'Your code contains def launch(): and calls launch().',
    hint: 'Defining a function does not run it. Add a call after the definition.',
    steps: ['Define launch.', 'Put a message inside it.', 'Call launch and press Play.'],
    vocabulary: ['def', 'function', 'call'],
    projectIdea: 'Make a reusable astronaut greeting.',
    starterXml: start(simpleFunction('launch', 'Engines ready!', call('launch'))),
  },
  {
    id: 'space-m2-2', module: 'Space Explorer · Module 2',
    title: '6 · Reuse a Helper', goal: 'Call a function more than once.',
    concept: 'reusable functions', level: 'Build', duration: '9 min',
    mission: 'Use the same radio-check function twice without copying its messages.',
    instructions: 'Change the message inside the function once; watch both calls change.',
    successCriteria: 'One function is defined and called at least twice.',
    hint: 'Use one define block and two call blocks with exactly the same name.',
    steps: ['Define radio_check.', 'Call it twice.', 'Change the message and run again.'],
    vocabulary: ['reuse', 'function', 'call'],
    projectIdea: 'Make a helper that celebrates every planet landing.',
    starterXml: start(simpleFunction('radio_check', 'All systems go!',
      call('radio_check', call('radio_check')))),
  },
  {
    id: 'space-m2-3', module: 'Space Explorer · Module 2',
    title: '7 · Pass a Planet', goal: 'Give a function information.',
    concept: 'function parameters', level: 'Stretch', duration: '12 min',
    mission: 'Create visit(planet) and tell it which world to explore.',
    instructions: 'Use My Blocks: a function with a parameter, print the parameter, then call with Mars.',
    successCriteria: 'Python has a function parameter and a call that passes an argument.',
    hint: 'A parameter is a named input for a function. The call supplies its value.',
    steps: ['Define visit with parameter planet.', 'Print the planet parameter.', 'Call visit with Mars.'],
    vocabulary: ['parameter', 'argument', 'def'],
    projectIdea: 'Try calling visit with Moon instead of Mars.',
    starterXml: start(parameterFunction('visit', 'planet', callWith('visit', 'Mars'))),
  },
  {
    id: 'space-m2-4', module: 'Space Explorer · Module 2',
    title: '8 · Two Planet Missions', goal: 'Reuse functions with different arguments.',
    concept: 'parameters and reuse', level: 'Stretch', duration: '10 min',
    mission: 'Send the same helper to Mars and Jupiter.',
    instructions: 'Run both calls. Change one planet to see what stays the same.',
    successCriteria: 'A function with a parameter is called at least twice.',
    hint: 'Keep one function definition. The argument can change each time.',
    steps: ['Define visit(planet).', 'Call visit with Mars.', 'Call again with Jupiter and compare.'],
    vocabulary: ['reuse', 'argument', 'parameter'],
    projectIdea: 'Visit a third invented planet.',
    starterXml: start(parameterFunction('visit', 'planet',
      callWith('visit', 'Mars', callWith('visit', 'Jupiter')))),
  },
  {
    id: spaceExplorerProjectId, module: 'Space Explorer · Final Project',
    title: '9 · Build Your Space Mission', goal: 'Build and test an original adventure.',
    concept: 'final project', level: 'Stretch', duration: '20–30 min',
    mission: 'Combine two questions, a choice, a loop, and a reusable function.',
    instructions: 'This is a starter, not a finished solution. Add if/else, a loop, and a function you define AND call. Test two choices with a friend or volunteer.',
    successCriteria: 'Two inputs, if/else, a loop, and a function run correctly; test twice.',
    hint: 'Build one piece at a time: ask, choose, repeat, define, call.',
    steps: ['Ask for an invented astronaut nickname and a planet.',
      'Use if/else to pack different equipment.',
      'Add a repeated launch check.',
      'Define and call a function.',
      'Run twice, then show a volunteer.'],
    vocabulary: ['project', 'test', 'debug', 'function'],
    projectIdea: 'Create your own ending, sound or mission-control message.',
    starterXml: start(say('My Space Explorer final mission',
      ask('Astronaut nickname: ', 'explorer', ask('Mars or Jupiter? ', 'planet'))),
    ['explorer', 'planet']),
  },
  {
    id: 'space-bonus-1', module: 'Space Explorer · Bonus Missions',
    title: 'Bonus 1 · Treasure Collector', goal: 'Collect space treasures and earn stars.',
    concept: 'parameters, return and scores', level: 'Stretch', duration: '10–15 min',
    mission: 'Make collect_treasure(item) print an item and return five bonus stars.',
    instructions: 'Run the starter with two treasures. Then change a treasure, add another call and experiment with the points awarded.',
    successCriteria: 'Your function accepts an item, returns a number, and you add scores from at least two calls.',
    hint: 'Look inside My Blocks for return value and call for value. return hands a score back to the stars calculation.',
    steps: ['Read the collect_treasure function and its return block.',
      'Press Play and check the total (10 stars).',
      'Change an item or award 10 points instead of 5.',
      'Add a third treasure and explain your new total.'],
    vocabulary: ['parameter', 'return', 'score', 'variable'],
    projectIdea: 'Invent a comet jewel, moon crystal or another treasure. Use pretend names only.',
    starterXml: treasureStarter,
  },
  {
    id: 'space-bonus-2', module: 'Space Explorer · Bonus Missions',
    title: 'Bonus 2 · Planet Explorer', goal: 'Reuse a function and a countdown loop.',
    concept: 'functions with parameters and loops', level: 'Stretch', duration: '10–15 min',
    mission: 'Visit several planets using the same helper and repeat some launch checks.',
    instructions: 'Try the three planet visits. Change their names, then move the repeat block or add your own planet.',
    successCriteria: 'Your parameter function runs more than once and a loop repeats a launch check.',
    hint: 'One define block is enough. Each call can supply a different planet name.',
    steps: ['Define visit_planet with parameter planet.',
      'Call it for Mars and Jupiter.',
      'Add a repeat loop for launch checks.',
      'Try Saturn or an invented planet.'],
    vocabulary: ['function', 'argument', 'for', 'repeat'],
    projectIdea: 'Challenge a friend to add a fourth destination.',
    starterXml: start(parameterFunction('visit_planet', 'planet',
      callWith('visit_planet', 'Mars',
        repeat(3, 'Launch check!',
          callWith('visit_planet', 'Jupiter', callWith('visit_planet', 'Saturn')))))),
  },
  {
    id: 'space-bonus-3', module: 'Space Explorer · Bonus Missions',
    title: 'Bonus 3 · Alien Quiz', goal: 'Return points for a correct answer.',
    concept: 'functions, input, if/else and return', level: 'Stretch', duration: '15–20 min',
    mission: 'Ask a space question. Award 10 stars for Mars and zero for a different answer.',
    instructions: 'Play twice using Mars and Jupiter. Then create a new space question and change the correct answer in the choice block.',
    successCriteria: 'A called quiz function asks a question, chooses with if/else, and returns a score.',
    hint: 'The function returns 10 or 0. The stars variable remembers the number, then print shows it.',
    steps: ['Run the quiz and answer Mars.',
      'Try Jupiter and compare the result.',
      'Change the question and expected answer together.',
      'Challenge a friend and explain why their score changed.'],
    vocabulary: ['input', 'if/else', 'return', 'score'],
    projectIdea: 'Make a two-question space quiz by adding a second function.',
    starterXml: quizStarter,
  },
];

// Bonus missions are entirely optional: never include them in core progress or certificates.
export const spaceExplorerBonusIds = ['space-bonus-1', 'space-bonus-2', 'space-bonus-3'];
export const spaceExplorerBonusLessons = spaceExplorerLessons.filter((lesson) =>
  spaceExplorerBonusIds.includes(lesson.id));
export const spaceExplorerLessonIds = spaceExplorerLessons
  .filter((lesson) => !spaceExplorerBonusIds.includes(lesson.id))
  .map((lesson) => lesson.id);
