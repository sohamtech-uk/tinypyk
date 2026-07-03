import type { LearningTrack, Lesson, LessonExercise, ProjectPath } from '../types/lesson';

const workspaceXml = (blocks: string) => `
<xml xmlns="https://developers.google.com/blockly/xml">
  ${blocks}
</xml>`;

const baseLessons: Lesson[] = [
  {
    id: 'lesson-1',
    module: 'Level 1',
    title: 'Level 1: Print',
    goal: 'Use print() to show words in the output.',
    concept: 'print()',
    level: 'Start',
    duration: '5 min',
    mission: 'Make Python print a friendly message.',
    instructions: 'Start with one print block. Change the words, press the green flag, and read the output.',
    successCriteria: 'The output shows your message and the Python code starts with print().',
    hint: 'Text in Python goes inside quotation marks, like print("Hello").',
    steps: ['Add a print block.', 'Change the message.', 'Press the green flag and read the output.'],
    vocabulary: ['print', 'text', 'output'],
    projectIdea: 'Print a tiny poem, a joke, or your character name.',
    starterXml: workspaceXml(`
      <block type="start_program" x="24" y="24">
        <next>
          <block type="say_message">
            <field name="MESSAGE">Hello, Python!</field>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-2',
    module: 'Level 2',
    title: 'Level 2: Ask',
    goal: 'Use input() to ask a question and save the answer.',
    concept: 'input()',
    level: 'Start',
    duration: '6 min',
    mission: 'Ask the player for their name.',
    instructions: 'Use an ask block, type an answer in the input box, then print a reply.',
    successCriteria: 'The input box appears and the output shows a response.',
    hint: 'input() waits. Type an answer in the input box, then press Send.',
    steps: ['Ask a question.', 'Type an answer when the program waits.', 'Print a friendly reply.'],
    vocabulary: ['input', 'answer', 'variable'],
    projectIdea: 'Make a name greeter, pet namer, or joke starter.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="name-id">name</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="ask_question">
            <field name="QUESTION">What is your name?</field>
            <field name="VAR" id="name-id">name</field>
            <next>
              <block type="say_message">
                <field name="MESSAGE">Nice to meet you!</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-3',
    module: 'Level 3',
    title: 'Level 3: Variables',
    goal: 'Save a value and print it later.',
    concept: 'Variable',
    level: 'Start',
    duration: '7 min',
    mission: 'Store a word in a variable named hero.',
    instructions: 'Set a variable, then print the variable so Python can reuse saved information.',
    successCriteria: 'Changing the variable value changes what the program prints.',
    hint: 'A variable is a named box for one value.',
    steps: ['Set hero to a word.', 'Print hero.', 'Change the value and play again.'],
    vocabulary: ['variable', 'value', 'reuse'],
    projectIdea: 'Save a superhero name, team name, or magic word.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="hero-id">hero</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="variables_set">
            <field name="VAR" id="hero-id">hero</field>
            <value name="VALUE">
              <block type="text">
                <field name="TEXT">Tiny coder</field>
              </block>
            </value>
            <next>
              <block type="text_print">
                <value name="TEXT">
                  <block type="variables_get">
                    <field name="VAR" id="hero-id">hero</field>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-4',
    module: 'Level 4',
    title: 'Level 4: Quotes',
    goal: 'Use quotation marks for exact text.',
    concept: 'Strings',
    level: 'Start',
    duration: '7 min',
    mission: 'Print a sentence with spaces and punctuation.',
    instructions: 'Use print with a text value. Notice how Python keeps the words inside quotes together.',
    successCriteria: 'The printed sentence matches the text you wrote.',
    hint: 'Python prints the characters between the opening and closing quotes.',
    steps: ['Write a sentence.', 'Keep the text inside quotes.', 'Press Play and compare code with output.'],
    vocabulary: ['string', 'quote', 'sentence'],
    projectIdea: 'Write a menu, spell, sign, or story title.',
    starterXml: workspaceXml(`
      <block type="start_program" x="24" y="24">
        <next>
          <block type="text_print">
            <value name="TEXT">
              <block type="text">
                <field name="TEXT">The cat says hello!</field>
              </block>
            </value>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-5',
    module: 'Level 5',
    title: 'Level 5: If',
    goal: 'Use if to run code only when a condition is true.',
    concept: 'if',
    level: 'Start',
    duration: '9 min',
    mission: 'Make a password checker.',
    instructions: 'Ask for a secret word, compare it with text, then print a message only when it matches.',
    successCriteria: 'The message appears only for the correct answer.',
    hint: 'The comparison block asks, "Are these two values equal?"',
    steps: ['Ask for a password.', 'Compare the answer with a secret word.', 'Print inside the if block.'],
    vocabulary: ['if', 'condition', 'compare'],
    projectIdea: 'Make a treasure door, quiz answer, or secret club code.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="password-id">password</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="ask_question">
            <field name="QUESTION">What is the secret word?</field>
            <field name="VAR" id="password-id">password</field>
            <next>
              <block type="control_if">
                <value name="IF">
                  <block type="logic_compare">
                    <field name="OP">EQ</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR" id="password-id">password</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="text">
                        <field name="TEXT">python</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO">
                  <block type="say_message">
                    <field name="MESSAGE">Access granted!</field>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-6',
    module: 'Level 6',
    title: 'Level 6: Maths',
    goal: 'Use Python to calculate a number.',
    concept: 'Arithmetic',
    level: 'Build',
    duration: '9 min',
    mission: 'Add two numbers and print the result.',
    instructions: 'Use a maths block inside a variable, then print the variable.',
    successCriteria: 'The output shows the calculated answer.',
    hint: 'Python can calculate before it prints.',
    steps: ['Set score to a calculation.', 'Print score.', 'Change the numbers and predict the output.'],
    vocabulary: ['number', 'operator', 'calculate'],
    projectIdea: 'Make a points counter, snack calculator, or score board.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="score-id">score</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="variables_set">
            <field name="VAR" id="score-id">score</field>
            <value name="VALUE">
              <block type="math_arithmetic">
                <field name="OP">ADD</field>
                <value name="A">
                  <block type="math_number">
                    <field name="NUM">3</field>
                  </block>
                </value>
                <value name="B">
                  <block type="math_number">
                    <field name="NUM">4</field>
                  </block>
                </value>
              </block>
            </value>
            <next>
              <block type="text_print">
                <value name="TEXT">
                  <block type="variables_get">
                    <field name="VAR" id="score-id">score</field>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-7',
    module: 'Level 7',
    title: 'Level 7: Repeat',
    goal: 'Repeat one line of code several times.',
    concept: 'Loop',
    level: 'Build',
    duration: '9 min',
    mission: 'Print the same cheer three times.',
    instructions: 'Put a print block inside repeat. Python turns this into a loop.',
    successCriteria: 'The output shows the same line more than once.',
    hint: 'A loop saves you from copying the same block again and again.',
    steps: ['Add repeat.', 'Put print inside it.', 'Change the repeat count.'],
    vocabulary: ['repeat', 'loop', 'count'],
    projectIdea: 'Make a chant, drum pattern, or countdown phrase.',
    starterXml: workspaceXml(`
      <block type="start_program" x="24" y="24">
        <next>
          <block type="controls_repeat_ext">
            <value name="TIMES">
              <shadow type="math_number">
                <field name="NUM">3</field>
              </shadow>
            </value>
            <statement name="DO">
              <block type="say_message">
                <field name="MESSAGE">Again!</field>
              </block>
            </statement>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-8',
    module: 'Level 8',
    title: 'Level 8: Indentation',
    goal: 'Put more than one command inside a loop.',
    concept: 'Indentation',
    level: 'Build',
    duration: '10 min',
    mission: 'Repeat a two-line mini song.',
    instructions: 'Blocks inside a repeat become indented Python lines.',
    successCriteria: 'Both printed lines repeat in the correct order.',
    hint: 'Indented lines belong to the loop above them.',
    steps: ['Put two print blocks inside repeat.', 'Look at the spaces in the Python.', 'Play and count the lines.'],
    vocabulary: ['indent', 'block', 'order'],
    projectIdea: 'Write a chorus, spell, or robot dance call.',
    starterXml: workspaceXml(`
      <block type="start_program" x="24" y="24">
        <next>
          <block type="controls_repeat_ext">
            <value name="TIMES">
              <shadow type="math_number">
                <field name="NUM">2</field>
              </shadow>
            </value>
            <statement name="DO">
              <block type="say_message">
                <field name="MESSAGE">Clap</field>
                <next>
                  <block type="say_message">
                    <field name="MESSAGE">Jump</field>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-9',
    module: 'Level 9',
    title: 'Level 9: If and Else',
    goal: 'Choose between two paths with if and else.',
    concept: 'if else',
    level: 'Build',
    duration: '11 min',
    mission: 'Welcome one special name and greet everyone else.',
    instructions: 'Ask for a name, check it, then add an else message for every other answer.',
    successCriteria: 'Different answers can create different output.',
    hint: 'else runs when the if condition is false.',
    steps: ['Ask for a name.', 'Add if for one answer.', 'Add else for all other answers.'],
    vocabulary: ['else', 'branch', 'choice'],
    projectIdea: 'Make a restaurant greeter, quiz reply, or character dialogue.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="friend-id">friend</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="ask_question">
            <field name="QUESTION">What is your name?</field>
            <field name="VAR" id="friend-id">friend</field>
            <next>
              <block type="control_if_else">
                <value name="IF">
                  <block type="logic_compare">
                    <field name="OP">EQ</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR" id="friend-id">friend</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="text">
                        <field name="TEXT">Hedy</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO">
                  <block type="say_message">
                    <field name="MESSAGE">Welcome Hedy!</field>
                  </block>
                </statement>
                <statement name="ELSE">
                  <block type="say_message">
                    <field name="MESSAGE">Welcome friend!</field>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-10',
    module: 'Level 10',
    title: 'Level 10: Lists',
    goal: 'Put several values into one list.',
    concept: 'List',
    level: 'Build',
    duration: '11 min',
    mission: 'Save three pet names in one variable.',
    instructions: 'Create a list, store it in a variable, then print the list.',
    successCriteria: 'The Python shows square brackets and the output prints the list.',
    hint: 'A list keeps values in order inside square brackets.',
    steps: ['Create a list with three text items.', 'Save it in a variable.', 'Print the variable.'],
    vocabulary: ['list', 'item', 'brackets'],
    projectIdea: 'Make a list of pets, foods, powers, or quiz answers.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="pets-id">pets</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="variables_set">
            <field name="VAR" id="pets-id">pets</field>
            <value name="VALUE">
              <block type="lists_create_with">
                <mutation items="3"></mutation>
                <value name="ADD0">
                  <block type="text">
                    <field name="TEXT">cat</field>
                  </block>
                </value>
                <value name="ADD1">
                  <block type="text">
                    <field name="TEXT">robot</field>
                  </block>
                </value>
                <value name="ADD2">
                  <block type="text">
                    <field name="TEXT">wizard</field>
                  </block>
                </value>
              </block>
            </value>
            <next>
              <block type="text_print">
                <value name="TEXT">
                  <block type="variables_get">
                    <field name="VAR" id="pets-id">pets</field>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-11',
    module: 'Level 11',
    title: 'Level 11: For Loops',
    goal: 'Count through a range of numbers.',
    concept: 'for',
    level: 'Build',
    duration: '12 min',
    mission: 'Print the numbers 1 to 5.',
    instructions: 'Use a for loop to make Python count for you.',
    successCriteria: 'The output prints five numbers in order.',
    hint: 'A for loop repeats with a variable that changes each time.',
    steps: ['Create a for loop.', 'Count from 1 to 5.', 'Print the counter.'],
    vocabulary: ['for', 'range', 'counter'],
    projectIdea: 'Make a countdown, steps tracker, or level list.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="count-id">count</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="controls_for">
            <field name="VAR" id="count-id">count</field>
            <value name="FROM">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
            <value name="TO">
              <shadow type="math_number">
                <field name="NUM">5</field>
              </shadow>
            </value>
            <value name="BY">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
            <statement name="DO">
              <block type="text_print">
                <value name="TEXT">
                  <block type="variables_get">
                    <field name="VAR" id="count-id">count</field>
                  </block>
                </value>
              </block>
            </statement>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-12',
    module: 'Level 12',
    title: 'Level 12: Functions',
    goal: 'Define a function and call it later.',
    concept: 'function',
    level: 'Stretch',
    duration: '12 min',
    mission: 'Make a helper function and call it twice.',
    instructions: 'Define a named function, put print blocks inside it, then call the function when you want those lines to run.',
    successCriteria: 'The Python code uses def and the output appears when the function is called.',
    hint: 'A function is a named mini-program. Python reads the definition, then runs it when you call the name.',
    steps: ['Define a function.', 'Put one or two print blocks inside it.', 'Call the function after the definition.'],
    vocabulary: ['def', 'function', 'call'],
    projectIdea: 'Make a greeting helper, chorus helper, or story scene helper.',
    starterXml: workspaceXml(`
      <block type="start_program" x="24" y="24">
        <next>
          <block type="function_define_simple">
            <field name="NAME">greet</field>
            <statement name="DO">
              <block type="say_message">
                <field name="MESSAGE">Hello from a function!</field>
              </block>
            </statement>
            <next>
              <block type="function_call_simple">
                <field name="NAME">greet</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-13',
    module: 'Level 13',
    title: 'Level 13: And / Or',
    goal: 'Combine conditions with and or or.',
    concept: 'and / or',
    level: 'Stretch',
    duration: '12 min',
    mission: 'Make a rule that checks two facts.',
    instructions: 'Use boolean logic to make Python check more than one condition.',
    successCriteria: 'The program only prints when the combined rule is true.',
    hint: 'and means both conditions must be true. or means at least one is true.',
    steps: ['Create two comparisons.', 'Join them with and or or.', 'Print a result inside if.'],
    vocabulary: ['and', 'or', 'boolean'],
    projectIdea: 'Make a club entry rule, game power-up, or quiz filter.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="score-id">score</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="variables_set">
            <field name="VAR" id="score-id">score</field>
            <value name="VALUE">
              <block type="math_number">
                <field name="NUM">8</field>
              </block>
            </value>
            <next>
              <block type="control_if">
                <value name="IF">
                  <block type="logic_operation">
                    <field name="OP">AND</field>
                    <value name="A">
                      <block type="logic_compare">
                        <field name="OP">GT</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR" id="score-id">score</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="math_number">
                            <field name="NUM">5</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <value name="B">
                      <block type="logic_compare">
                        <field name="OP">LT</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR" id="score-id">score</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="math_number">
                            <field name="NUM">10</field>
                          </block>
                        </value>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO">
                  <block type="say_message">
                    <field name="MESSAGE">Score is in the target zone!</field>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-14',
    module: 'Level 14',
    title: 'Level 14: Comparisons',
    goal: 'Compare numbers with greater than and less than.',
    concept: 'Compare',
    level: 'Stretch',
    duration: '12 min',
    mission: 'Check if a score beats a target.',
    instructions: 'Use comparison operators to decide whether a number is big enough.',
    successCriteria: 'Changing the score can change whether the message prints.',
    hint: '> means greater than. < means less than.',
    steps: ['Set a score.', 'Compare it with a target.', 'Print when the comparison is true.'],
    vocabulary: ['greater than', 'less than', 'target'],
    projectIdea: 'Make a high-score checker, age rule, or quiz pass mark.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="score-id">score</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="variables_set">
            <field name="VAR" id="score-id">score</field>
            <value name="VALUE">
              <block type="math_number">
                <field name="NUM">10</field>
              </block>
            </value>
            <next>
              <block type="control_if">
                <value name="IF">
                  <block type="logic_compare">
                    <field name="OP">GT</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR" id="score-id">score</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_number">
                        <field name="NUM">5</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO">
                  <block type="say_message">
                    <field name="MESSAGE">You beat the target!</field>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-15',
    module: 'Level 15',
    title: 'Level 15: While',
    goal: 'Repeat while a condition stays true.',
    concept: 'while',
    level: 'Stretch',
    duration: '14 min',
    mission: 'Count up until a number reaches 4.',
    instructions: 'Use while with a changing variable so the loop can stop.',
    successCriteria: 'The loop prints 1, 2, and 3, then stops.',
    hint: 'Always change the variable inside a while loop, or it may never stop.',
    steps: ['Set count to 1.', 'Repeat while count is less than 4.', 'Add 1 to count inside the loop.'],
    vocabulary: ['while', 'condition', 'update'],
    projectIdea: 'Make a timer, retry loop, or simple game turn counter.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="count-id">count</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="variables_set">
            <field name="VAR" id="count-id">count</field>
            <value name="VALUE">
              <block type="math_number">
                <field name="NUM">1</field>
              </block>
            </value>
            <next>
              <block type="controls_whileUntil">
                <field name="MODE">WHILE</field>
                <value name="BOOL">
                  <block type="logic_compare">
                    <field name="OP">LT</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR" id="count-id">count</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_number">
                        <field name="NUM">4</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="variables_get">
                        <field name="VAR" id="count-id">count</field>
                      </block>
                    </value>
                    <next>
                      <block type="variables_set">
                        <field name="VAR" id="count-id">count</field>
                        <value name="VALUE">
                          <block type="math_arithmetic">
                            <field name="OP">ADD</field>
                            <value name="A">
                              <block type="variables_get">
                                <field name="VAR" id="count-id">count</field>
                              </block>
                            </value>
                            <value name="B">
                              <block type="math_number">
                                <field name="NUM">1</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-16',
    module: 'Level 16',
    title: 'Level 16: Data Story',
    goal: 'Combine input, variables, conditions, and output in one project.',
    concept: 'Project',
    level: 'Stretch',
    duration: '15 min',
    mission: 'Build a tiny data story from a question.',
    instructions: 'Ask for data, save it, check it, and print a result. This final level combines the Python ideas you have learned.',
    successCriteria: 'The project uses input(), a variable, if/else, and print().',
    hint: 'Build it one idea at a time: ask, save, check, print.',
    steps: ['Ask a survey question.', 'Use a condition to check the answer.', 'Print a result for the player.'],
    vocabulary: ['combine', 'project', 'data story'],
    projectIdea: 'Make a mood helper, favourite-colour sorter, or mini recommendation bot.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="choice-id">choice</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="ask_question">
            <field name="QUESTION">Do you like coding?</field>
            <field name="VAR" id="choice-id">choice</field>
            <next>
              <block type="control_if_else">
                <value name="IF">
                  <block type="logic_compare">
                    <field name="OP">EQ</field>
                    <value name="A">
                      <block type="variables_get">
                        <field name="VAR" id="choice-id">choice</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="text">
                        <field name="TEXT">yes</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO">
                  <block type="say_message">
                    <field name="MESSAGE">You are ready for more Python!</field>
                  </block>
                </statement>
                <statement name="ELSE">
                  <block type="say_message">
                    <field name="MESSAGE">Try one tiny step today.</field>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
  {
    id: 'lesson-17',
    module: 'Level 17',
    title: 'Level 17: Final Project',
    goal: 'Combine the Python ideas into one small project.',
    concept: 'Capstone',
    level: 'Stretch',
    duration: '18 min',
    mission: 'Build, test, and improve a tiny Python helper.',
    instructions: 'Use print(), input(), variables, if/else, and repeat together. Test more than one answer and improve the messages.',
    successCriteria: 'The project asks a question, saves the answer, chooses a response, and repeats one friendly line.',
    hint: 'Build the project one part at a time. First print, then ask, then choose, then repeat.',
    steps: [
      'Print a title for your project.',
      'Ask one question and save the answer.',
      'Use if/else to choose a reply.',
      'Repeat one final message and test two answers.',
    ],
    vocabulary: ['capstone', 'test', 'improve'],
    projectIdea: 'Make a mood helper, class greeter, quiz friend, or kindness bot.',
    starterXml: workspaceXml(`
      <variables>
        <variable id="mood-id">mood</variable>
      </variables>
      <block type="start_program" x="24" y="24">
        <next>
          <block type="say_message">
            <field name="MESSAGE">TinyPyk final project</field>
            <next>
              <block type="ask_question">
                <field name="QUESTION">How do you feel today?</field>
                <field name="VAR" id="mood-id">mood</field>
                <next>
                  <block type="control_if_else">
                    <value name="IF">
                      <block type="logic_compare">
                        <field name="OP">EQ</field>
                        <value name="A">
                          <block type="variables_get">
                            <field name="VAR" id="mood-id">mood</field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="text">
                            <field name="TEXT">happy</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="say_message">
                        <field name="MESSAGE">Keep shining!</field>
                      </block>
                    </statement>
                    <statement name="ELSE">
                      <block type="say_message">
                        <field name="MESSAGE">Try one tiny Python step.</field>
                      </block>
                    </statement>
                    <next>
                      <block type="controls_repeat_ext">
                        <value name="TIMES">
                          <shadow type="math_number">
                            <field name="NUM">2</field>
                          </shadow>
                        </value>
                        <statement name="DO">
                          <block type="say_message">
                            <field name="MESSAGE">I can improve my code!</field>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    `),
  },
];

const lessonExercises: Record<string, LessonExercise[]> = {
  'lesson-1': [
    {
      id: 'print-hello',
      title: 'print',
      kind: 'Warm-up',
      mission: 'Print one friendly message.',
      steps: ['Use one print block.', 'Change the words.', 'Press Play and read the output.'],
      successCriteria: 'The output shows the exact message you wrote.',
    },
    {
      id: 'print-parrot',
      title: 'parrot',
      kind: 'Build',
      mission: 'Make the character repeat a silly sentence.',
      steps: ['Add two print blocks.', 'Use the same words first.', 'Change one word and compare the output.'],
      successCriteria: 'Two lines appear in the output.',
    },
    {
      id: 'print-story',
      title: 'tiny story',
      kind: 'Challenge',
      mission: 'Print a three-line story with a beginning, middle, and end.',
      steps: ['Add three print blocks.', 'Write one short line in each.', 'Play the story from top to bottom.'],
      successCriteria: 'The output has three story lines in order.',
    },
    {
      id: 'print-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Fix a message so it prints clearly.',
      steps: ['Look for a missing word or odd spelling.', 'Change the print text.', 'Play again to check it.'],
      successCriteria: 'The output is readable and friendly.',
    },
  ],
  'lesson-2': [
    {
      id: 'input-name',
      title: 'ask',
      kind: 'Warm-up',
      mission: 'Ask for a name and save the answer.',
      steps: ['Use an ask block.', 'Type an answer in the input box.', 'Print a reply.'],
      successCriteria: 'The program waits for input, then continues.',
    },
    {
      id: 'input-pet',
      title: 'pet namer',
      kind: 'Build',
      mission: 'Ask for a pet name and print a pet greeting.',
      steps: ['Ask one question.', 'Save the answer.', 'Print a friendly pet message.'],
      successCriteria: 'The input box is used once and the output responds.',
    },
    {
      id: 'input-quiz',
      title: 'quiz starter',
      kind: 'Challenge',
      mission: 'Ask a quiz question before you learn if statements.',
      steps: ['Ask a question.', 'Print a thank-you message.', 'Think about how a later level could check the answer.'],
      successCriteria: 'The learner can answer the question and see output.',
    },
    {
      id: 'input-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Find why the program is waiting.',
      steps: ['Press Play.', 'Look for the input prompt.', 'Type an answer and press Send.'],
      successCriteria: 'The program finishes after the answer is sent.',
    },
  ],
  'lesson-3': [
    {
      id: 'var-hero',
      title: 'variables',
      kind: 'Warm-up',
      mission: 'Save a hero name and print it.',
      steps: ['Create or use a variable.', 'Set it to text.', 'Print the variable.'],
      successCriteria: 'Changing the variable changes the output.',
    },
    {
      id: 'var-score',
      title: 'score board',
      kind: 'Build',
      mission: 'Save a score and print it.',
      steps: ['Set score to a number.', 'Print score.', 'Change the number and play again.'],
      successCriteria: 'The output shows the saved score.',
    },
    {
      id: 'var-story',
      title: 'story name',
      kind: 'Challenge',
      mission: 'Save a character name for a story.',
      steps: ['Set a variable to a character name.', 'Print the variable.', 'Use the name in another print line.'],
      successCriteria: 'The saved name is reused.',
    },
    {
      id: 'var-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Check that the same variable is set and printed.',
      steps: ['Find the set block.', 'Find the print block.', 'Make sure they use the same variable name.'],
      successCriteria: 'The printed value matches the saved value.',
    },
  ],
  'lesson-4': [
    {
      id: 'strings-quotes',
      title: 'quotes',
      kind: 'Warm-up',
      mission: 'Print a sentence as a string.',
      steps: ['Use a text block.', 'Write a sentence with spaces.', 'Print the text value.'],
      successCriteria: 'The Python uses quotes around text.',
    },
    {
      id: 'strings-menu',
      title: 'restaurant',
      kind: 'Build',
      mission: 'Print a tiny menu.',
      steps: ['Print a title.', 'Print two food choices.', 'Use punctuation in your strings.'],
      successCriteria: 'The output looks like a short menu.',
    },
    {
      id: 'strings-story',
      title: 'story',
      kind: 'Challenge',
      mission: 'Write a tiny story with exact text.',
      steps: ['Use three text print blocks.', 'Add punctuation.', 'Check the Python quotes.'],
      successCriteria: 'The story text prints exactly as written.',
    },
    {
      id: 'strings-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Spot the difference between text and a variable.',
      steps: ['Print a text value.', 'Print a variable value.', 'Compare the generated Python.'],
      successCriteria: 'You can explain why one uses quotes and one does not.',
    },
  ],
  'lesson-5': [
    {
      id: 'if-password',
      title: 'if',
      kind: 'Warm-up',
      mission: 'Print a message only when a secret word matches.',
      steps: ['Ask for a word.', 'Compare it with the secret.', 'Put print inside the if block.'],
      successCriteria: 'The message appears only for the matching answer.',
    },
    {
      id: 'if-quiz',
      title: 'quiz',
      kind: 'Build',
      mission: 'Check one quiz answer.',
      steps: ['Ask a question.', 'Use equals to check the answer.', 'Print a success message.'],
      successCriteria: 'Correct and incorrect answers behave differently.',
    },
    {
      id: 'if-door',
      title: 'treasure door',
      kind: 'Challenge',
      mission: 'Open a treasure door with an if statement.',
      steps: ['Ask for a key word.', 'Check the answer.', 'Print a treasure message only if the key is right.'],
      successCriteria: 'The treasure message is protected by the condition.',
    },
    {
      id: 'if-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Find why an if message never appears.',
      steps: ['Check the comparison text.', 'Check the input answer.', 'Play again with the exact match.'],
      successCriteria: 'The if branch can run.',
    },
  ],
  'lesson-6': [
    {
      id: 'math-add',
      title: 'maths',
      kind: 'Warm-up',
      mission: 'Add two numbers and print the result.',
      steps: ['Use a maths block.', 'Save the answer or print it.', 'Change the numbers.'],
      successCriteria: 'Python calculates before it prints.',
    },
    {
      id: 'math-score',
      title: 'score keeper',
      kind: 'Build',
      mission: 'Make a score grow.',
      steps: ['Set a score.', 'Add points.', 'Print the new score.'],
      successCriteria: 'The output changes when the points change.',
    },
    {
      id: 'math-random',
      title: 'dice',
      kind: 'Challenge',
      mission: 'Use a random number for a dice roll.',
      steps: ['Use random integer.', 'Save it as roll.', 'Print the roll.'],
      successCriteria: 'Play can show different numbers.',
    },
    {
      id: 'math-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Check the order of a calculation.',
      steps: ['Look at the two number inputs.', 'Try add, subtract, or multiply.', 'Predict before pressing Play.'],
      successCriteria: 'Your prediction matches the output.',
    },
  ],
  'lesson-7': [
    {
      id: 'repeat-print',
      title: 'repeat',
      kind: 'Warm-up',
      mission: 'Repeat one print line.',
      steps: ['Add repeat.', 'Put print inside.', 'Choose the repeat count.'],
      successCriteria: 'The same output appears more than once.',
    },
    {
      id: 'repeat-music',
      title: 'music',
      kind: 'Build',
      mission: 'Repeat a short sound pattern.',
      steps: ['Use a repeat block.', 'Put a music block inside.', 'Play the pattern.'],
      successCriteria: 'The sound plays repeatedly.',
    },
    {
      id: 'repeat-countdown',
      title: 'chant',
      kind: 'Challenge',
      mission: 'Make a repeated chant for a character.',
      steps: ['Choose a chant word.', 'Repeat it three or four times.', 'Add one final print line after the loop.'],
      successCriteria: 'The final line appears after the repeated lines.',
    },
    {
      id: 'repeat-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Find what is inside and outside the repeat.',
      steps: ['Move one print inside repeat.', 'Move one print after repeat.', 'Compare the output.'],
      successCriteria: 'You can point to the repeated part.',
    },
  ],
  'lesson-8': [
    {
      id: 'indent-two-lines',
      title: 'indentation',
      kind: 'Warm-up',
      mission: 'Repeat two indented print lines.',
      steps: ['Put two blocks inside repeat.', 'Look at the generated spaces.', 'Play and count the output lines.'],
      successCriteria: 'Both indented lines repeat.',
    },
    {
      id: 'indent-song',
      title: 'song',
      kind: 'Build',
      mission: 'Build a tiny chorus.',
      steps: ['Repeat two lyric lines.', 'Add a final line after repeat.', 'Check what repeats.'],
      successCriteria: 'Only the indented chorus repeats.',
    },
    {
      id: 'indent-turtle',
      title: 'turtle',
      kind: 'Challenge',
      mission: 'Use repeated turtle moves to make a shape.',
      steps: ['Create a turtle.', 'Repeat move and turn.', 'Watch the drawing board.'],
      successCriteria: 'The turtle action repeats as a shape.',
    },
    {
      id: 'indent-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Fix a block that is in the wrong place.',
      steps: ['Find the line that should repeat.', 'Place it inside repeat.', 'Play again.'],
      successCriteria: 'The repeated output is correct.',
    },
  ],
  'lesson-9': [
    {
      id: 'if-else-name',
      title: 'if & else',
      kind: 'Warm-up',
      mission: 'Greet one name specially and everyone else kindly.',
      steps: ['Ask for a name.', 'Use if for one answer.', 'Use else for all other answers.'],
      successCriteria: 'Two different answers can create two different outputs.',
    },
    {
      id: 'if-else-restaurant',
      title: 'restaurant',
      kind: 'Build',
      mission: 'Recommend food with if and else.',
      steps: ['Ask for a choice.', 'Check one food.', 'Print a different message in else.'],
      successCriteria: 'The program always gives one response.',
    },
    {
      id: 'if-else-story',
      title: 'story',
      kind: 'Challenge',
      mission: 'Let the player choose a story path.',
      steps: ['Ask left or right.', 'Use if for one path.', 'Use else for the other path.'],
      successCriteria: 'Different choices change the story.',
    },
    {
      id: 'if-else-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Find why else is running.',
      steps: ['Check the comparison.', 'Check the answer spelling.', 'Try the exact matching answer.'],
      successCriteria: 'The if branch and else branch both work when expected.',
    },
  ],
  'lesson-10': [
    {
      id: 'list-pets',
      title: 'lists',
      kind: 'Warm-up',
      mission: 'Make a list of three pets.',
      steps: ['Create a list.', 'Add three text items.', 'Print the list.'],
      successCriteria: 'The Python shows square brackets.',
    },
    {
      id: 'list-random',
      title: 'random choice',
      kind: 'Build',
      mission: 'Make a tiny choice list.',
      steps: ['Create a list.', 'Try a list tool from the toolbox.', 'Use the output in a print line.'],
      successCriteria: 'The program uses more than one item in one value.',
    },
    {
      id: 'list-menu',
      title: 'menu',
      kind: 'Challenge',
      mission: 'Store a menu as a list.',
      steps: ['Create a food list.', 'Print the list.', 'Print the list length.'],
      successCriteria: 'The output shows the list and its size.',
    },
    {
      id: 'list-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Check how many items are in a list.',
      steps: ['Count the list items.', 'Use length.', 'Compare your count with Python.'],
      successCriteria: 'Your count matches the length output.',
    },
  ],
  'lesson-11': [
    {
      id: 'for-count',
      title: 'for loop',
      kind: 'Warm-up',
      mission: 'Count from 1 to 5.',
      steps: ['Use a for loop.', 'Choose start and end numbers.', 'Print the counter.'],
      successCriteria: 'The output shows numbers in order.',
    },
    {
      id: 'for-levels',
      title: 'levels',
      kind: 'Build',
      mission: 'Print level numbers for a game.',
      steps: ['Count from 1 to 3.', 'Print each number.', 'Add a message before or after the loop.'],
      successCriteria: 'The game levels print in sequence.',
    },
    {
      id: 'for-turtle',
      title: 'turtle pattern',
      kind: 'Challenge',
      mission: 'Use for to repeat turtle drawing.',
      steps: ['Create a turtle.', 'Use a for loop.', 'Move and turn inside the loop.'],
      successCriteria: 'The turtle repeats a drawing action.',
    },
    {
      id: 'for-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Find why the loop runs too many or too few times.',
      steps: ['Check the from number.', 'Check the to number.', 'Play and count the lines.'],
      successCriteria: 'The count matches your chosen range.',
    },
  ],
  'lesson-12': [
    {
      id: 'function-greet',
      title: 'functions',
      kind: 'Warm-up',
      mission: 'Define a greeting function and call it.',
      steps: ['Define a function.', 'Put print inside.', 'Call the function.'],
      successCriteria: 'The Python uses def and the function output appears.',
    },
    {
      id: 'function-chorus',
      title: 'chorus',
      kind: 'Build',
      mission: 'Make a chorus function for a song.',
      steps: ['Define chorus.', 'Put two print lines inside.', 'Call chorus twice.'],
      successCriteria: 'The chorus can run more than once without copying the lines.',
    },
    {
      id: 'function-scene',
      title: 'story scene',
      kind: 'Challenge',
      mission: 'Make a function for one story scene.',
      steps: ['Define scene_one.', 'Add print lines inside.', 'Call it after an intro line.'],
      successCriteria: 'The story uses a named function.',
    },
    {
      id: 'function-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Find why a function does not run.',
      steps: ['Check the function name.', 'Check the call name.', 'Make sure the call is after the definition.'],
      successCriteria: 'The function runs when called.',
    },
  ],
  'lesson-13': [
    {
      id: 'boolean-and',
      title: 'and',
      kind: 'Warm-up',
      mission: 'Check that two things are true.',
      steps: ['Make two comparisons.', 'Join them with and.', 'Put the rule inside if.'],
      successCriteria: 'The message appears only when both comparisons are true.',
    },
    {
      id: 'boolean-or',
      title: 'or',
      kind: 'Build',
      mission: 'Let either answer win.',
      steps: ['Ask a question.', 'Compare with two possible answers.', 'Join with or.'],
      successCriteria: 'Either matching answer can print the success message.',
    },
    {
      id: 'boolean-entry',
      title: 'club rule',
      kind: 'Challenge',
      mission: 'Make a two-part entry rule.',
      steps: ['Save a score.', 'Check it is in a target zone.', 'Print a club message.'],
      successCriteria: 'The rule combines two checks.',
    },
    {
      id: 'boolean-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Decide whether and or or is needed.',
      steps: ['Read the rule aloud.', 'Try and.', 'Try or and compare.'],
      successCriteria: 'The chosen operator matches the rule.',
    },
  ],
  'lesson-14': [
    {
      id: 'compare-score',
      title: 'comparisons',
      kind: 'Warm-up',
      mission: 'Check if a score is greater than a target.',
      steps: ['Set a score.', 'Compare score with target.', 'Print when the score wins.'],
      successCriteria: 'Changing the score can change the output.',
    },
    {
      id: 'compare-age',
      title: 'age rule',
      kind: 'Build',
      mission: 'Use less than or greater than for a simple rule.',
      steps: ['Set a number.', 'Choose a comparison.', 'Print a helpful result.'],
      successCriteria: 'The comparison controls the if block.',
    },
    {
      id: 'compare-high-low',
      title: 'high or low',
      kind: 'Challenge',
      mission: 'Sort a number into high or low.',
      steps: ['Set a number.', 'Use if/else.', 'Print high or low.'],
      successCriteria: 'Different numbers can produce different labels.',
    },
    {
      id: 'compare-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Find whether > or < is backwards.',
      steps: ['Read the comparison.', 'Try a small number.', 'Try a big number.'],
      successCriteria: 'The rule matches the words you meant.',
    },
  ],
  'lesson-15': [
    {
      id: 'while-count',
      title: 'while',
      kind: 'Warm-up',
      mission: 'Count while a number is small.',
      steps: ['Set count to 1.', 'Repeat while count is less than 4.', 'Add 1 inside the loop.'],
      successCriteria: 'The loop stops by itself.',
    },
    {
      id: 'while-retry',
      title: 'retry',
      kind: 'Build',
      mission: 'Use while for repeated tries.',
      steps: ['Save a number.', 'Use a while condition.', 'Change the number inside the loop.'],
      successCriteria: 'The program does not run forever.',
    },
    {
      id: 'while-timer',
      title: 'timer',
      kind: 'Challenge',
      mission: 'Make a small timer with while.',
      steps: ['Start a timer variable.', 'Print it inside while.', 'Update it each loop.'],
      successCriteria: 'The timer reaches its stop value.',
    },
    {
      id: 'while-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Find the update that stops an infinite loop.',
      steps: ['Look inside the while block.', 'Find the variable update.', 'Make sure it moves toward stopping.'],
      successCriteria: 'The loop can finish.',
    },
  ],
  'lesson-16': [
    {
      id: 'project-data-story',
      title: 'data story',
      kind: 'Warm-up',
      mission: 'Ask one question and tell a result.',
      steps: ['Ask for data.', 'Save the answer.', 'Use if/else to print a result.'],
      successCriteria: 'The project combines input, variables, conditions, and output.',
    },
    {
      id: 'project-quiz-bot',
      title: 'quiz bot',
      kind: 'Build',
      mission: 'Build a small quiz from the ideas you know.',
      steps: ['Ask a question.', 'Check the answer.', 'Print a response.'],
      successCriteria: 'The quiz has at least two possible responses.',
    },
    {
      id: 'project-recommender',
      title: 'recommendation bot',
      kind: 'Challenge',
      mission: 'Recommend something from an answer.',
      steps: ['Ask for a favourite thing.', 'Check it with conditions.', 'Print a recommendation.'],
      successCriteria: 'The recommendation depends on the answer.',
    },
    {
      id: 'project-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Test the final project with two different answers.',
      steps: ['Try one answer.', 'Try a different answer.', 'Fix any branch that does not run.'],
      successCriteria: 'Both paths have been tested.',
    },
  ],
  'lesson-17': [
    {
      id: 'capstone-plan',
      title: 'plan',
      kind: 'Warm-up',
      mission: 'Plan one final Python helper.',
      steps: ['Choose a helper idea.', 'Name the question it should ask.', 'Decide two possible replies.'],
      successCriteria: 'The project has a clear question and two safe responses.',
    },
    {
      id: 'capstone-build',
      title: 'build',
      kind: 'Build',
      mission: 'Build a final project with ask, if/else, and repeat.',
      steps: ['Ask a question.', 'Use if/else for replies.', 'Repeat one final message.'],
      successCriteria: 'The program uses at least four Python ideas together.',
    },
    {
      id: 'capstone-share',
      title: 'showcase',
      kind: 'Challenge',
      mission: 'Improve the words so someone else understands your project.',
      steps: ['Make the output friendly.', 'Test two answers.', 'Explain what your code does.'],
      successCriteria: 'A learner can describe the project in their own words.',
    },
    {
      id: 'capstone-debug',
      title: 'debugging',
      kind: 'Debug',
      mission: 'Test and fix the final project.',
      steps: ['Try the matching answer.', 'Try another answer.', 'Fix any message or condition that feels wrong.'],
      successCriteria: 'Both branches work and the project finishes.',
    },
  ],
};

const hedyStyleQuestTitles: Record<string, string[]> = {
  'lesson-1': [
    'print',
    'ask',
    'parrot',
    'rock, paper, scissors',
    'haunted house',
    'story',
    'music',
    'turtle',
    'draw it!',
    'restaurant',
    'fortune teller',
    'debugging',
    'hospital',
  ],
  'lesson-2': [
    'is',
    'rock, paper, scissors',
    'ask',
    'rock, paper, scissors 2',
    'haunted house',
    'sleep',
    'parrot',
    'story',
    'music',
    'restaurant',
    'turtle',
    'draw it!',
    'debugging',
    'hospital',
  ],
  'lesson-3': [
    'random',
    'dice',
    'rock, paper, scissors',
    'music',
    'fortune teller',
    'restaurant',
    'add to and remove from',
    'parrot',
    'dishes?',
    'story',
    'haunted house',
    'turtle',
    'draw it!',
    'debugging',
    'hospital',
  ],
  'lesson-4': [
    'quotation marks',
    'rock, paper, scissors',
    'dice',
    'dishes?',
    'parrot',
    'turtle',
    'draw it!',
    'clear',
    'music',
    'story',
    'haunted house',
    'fortune teller',
    'restaurant',
    'debugging',
    'hospital',
  ],
  'lesson-5': [
    'if and else',
    'music',
    'language',
    'dice',
    'dishes?',
    'story',
    'rock, paper, scissors',
    'parrot',
    'haunted house',
    'turtle',
    'draw it!',
    'debugging',
    'hospital',
  ],
  'lesson-6': ['elif', 'story', 'music', 'in', 'restaurant', 'fortune teller', 'debugging', 'hospital'],
  'lesson-7': [
    'maths',
    'is',
    'music',
    'sing a song!',
    'dice',
    'dishes?',
    'piggy bank',
    'turtle',
    'draw it!',
    'calculator',
    'fortune teller',
    'restaurant',
    'debugging',
    'hospital',
  ],
  'lesson-8': [
    'repeat',
    'story',
    'sing a song!',
    'music',
    'dishes?',
    'dice',
    'repeat 2',
    'fortune teller',
    'restaurant',
    'draw it!',
    'debugging',
    'hospital',
    'congratulations',
  ],
  'lesson-9': [
    'repeat',
    'fortune teller',
    'repeat 2',
    'sing a song!',
    'music',
    'if and else',
    'story',
    'restaurant',
    'turtle',
    'draw it!',
    'debugging',
    'hospital',
    "new year's",
  ],
  'lesson-10': [
    'repeat',
    'if and else',
    'and and or',
    'rock, paper, scissors',
    'story',
    'calculator',
    'calculator 2',
    'music',
    'super spy',
    'restaurant',
    'haunted house',
    'turtle',
    'draw it!',
    'debugging',
    'hospital',
  ],
  'lesson-11': [
    'for',
    'dishes?',
    'dice',
    'fortune teller',
    'turtle',
    'draw it!',
    'harry potter',
    'sing a song!',
    'sing a song! 2',
    'story',
    'rock, paper, scissors',
    'calculator',
    'restaurant',
    'debugging',
    'hospital',
  ],
  'lesson-12': [
    'functions',
    'music',
    'sing a song! 2',
    'turtle',
    'draw it!',
    'draw more!',
    'debugging',
    'hospital',
    'congratulations',
  ],
  'lesson-13': [
    'print',
    'ask',
    'if and else',
    'is',
    'operators',
    'story',
    'sing a song!',
    'quizmaster',
    'debugging',
    'hospital',
  ],
  'lesson-14': [
    'lists',
    'random',
    'for',
    'haunted house',
    'sing a song!',
    'draw it!',
    'language',
    'debugging',
    'hospital',
  ],
  'lesson-15': [
    'functions',
    'music',
    'music 2',
    'functions with arguments',
    'sing a song!',
    'draw more!',
    'music 3',
    'hotel',
    'functions with return value',
    'calculator',
    'calculator 2',
    'piggy bank',
    'draw it!',
    'debugging',
    'hospital',
  ],
  'lesson-16': [
    'while',
    'story',
    'dice',
    'rock, paper, scissors',
    'music',
    'draw it!',
    'calculator',
    'restaurant',
    'guess my number',
    'debugging',
    'hospital',
    'congratulations',
  ],
  'lesson-17': [
    'final project',
    'remix',
    'classroom demo',
    'data story',
    'tiny game',
    'voice-safe story',
    'debugging',
    'celebration',
  ],
};

const extraTinyPykQuestTitles: Record<string, string[]> = {
  'lesson-1': [
    'name badge',
    'robot hello',
    'silly sentence',
    'classroom chant',
    'pet announcer',
    'weather report',
    'treasure map',
    'joke machine',
    'space postcard',
    'kind words',
    'celebration',
  ],
  'lesson-2': [
    'name greeter',
    'pet interview',
    'secret question',
    'class poll',
    'weather helper',
    'music request',
    'snack survey',
    'travel ticket',
    'input detective',
    'birthday bot',
    'congratulations',
  ],
  'lesson-3': [
    'hero name',
    'team name',
    'magic word',
    'mood meter',
    'pet card',
    'birthday badge',
    'robot battery',
    'secret box',
    'class captain',
    'treasure label',
    'variable detective',
  ],
  'lesson-4': [
    'magic spell',
    'robot speech',
    'punctuation party',
    'shop sign',
    'city sign',
    'space log',
    'kindness card',
    'poster maker',
    'quote detective',
    'message mixer',
    'congratulations',
  ],
  'lesson-5': [
    'password door',
    'treasure check',
    'quiz badge',
    'weather choice',
    'club pass',
    'magic switch',
    'robot button',
    'pet mood',
    'condition detective',
    'secret cave',
    'congratulations',
  ],
  'lesson-6': [
    'points shop',
    'snack calculator',
    'classroom counter',
    'robot battery',
    'turtle distance',
    'restaurant total',
    'high score',
    'time table',
    'number detective',
    'party budget',
    'congratulations',
  ],
  'lesson-7': [
    'chant',
    'dance loop',
    'drum pattern',
    'rocket countdown',
    'practice lines',
    'spell repeat',
    'cheer squad',
    'loop detective',
    'badge printer',
    'robot steps',
    'congratulations',
  ],
  'lesson-8': [
    'two-line chorus',
    'robot dance',
    'story beat',
    'magic recipe',
    'space launch',
    'nested practice',
    'indent detective',
    'class routine',
    'turtle square',
    'pattern builder',
    'celebration',
  ],
  'lesson-9': [
    'choice door',
    'quiz reply',
    'pet chooser',
    'weather outfit',
    'friendly robot',
    'magic mirror',
    'branch detective',
    'space path',
    'birthday choice',
    'kindness helper',
    'congratulations',
  ],
  'lesson-10': [
    'pet list',
    'menu list',
    'treasure bag',
    'class team',
    'music playlist',
    'space packing',
    'random helper',
    'list detective',
    'badge collection',
    'story ingredients',
    'congratulations',
  ],
  'lesson-11': [
    'counting stars',
    'score ladder',
    'class register',
    'music bars',
    'turtle polygon',
    'exercise steps',
    'for detective',
    'badge parade',
    'rocket stages',
    'garden rows',
    'congratulations',
  ],
  'lesson-12': [
    'greeting helper',
    'story helper',
    'dance helper',
    'robot helper',
    'menu helper',
    'turtle helper',
    'function detective',
    'badge helper',
    'space helper',
    'kindness helper',
    'celebration',
  ],
  'lesson-13': [
    'two-key door',
    'either answer',
    'club entry',
    'quiz filter',
    'weather rule',
    'score zone',
    'boolean detective',
    'pet rule',
    'space checklist',
    'kindness rule',
    'congratulations',
  ],
  'lesson-14': [
    'high score check',
    'height checker',
    'speed limit',
    'price checker',
    'temperature check',
    'age rule',
    'comparison detective',
    'big or small',
    'target practice',
    'leader board',
    'congratulations',
  ],
  'lesson-15': [
    'count until',
    'retry gate',
    'timer',
    'energy meter',
    'guessing loop',
    'while detective',
    'safe loop',
    'rocket fuel',
    'practice timer',
    'story turns',
    'celebration',
  ],
  'lesson-16': [
    'favourite colour data',
    'mood survey',
    'class vote',
    'snack graph story',
    'recommendation bot',
    'question sorter',
    'data detective',
    'weather report',
    'safe voice survey',
    'mini dashboard',
    'celebration',
  ],
  'lesson-17': [
    'project plan',
    'starter build',
    'test two answers',
    'add a character',
    'choose a background',
    'make it speak',
    'add a sound',
    'write comments',
    'polish messages',
    'share checklist',
    'teacher demo',
    'family showcase',
  ],
};

const questSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const questKind = (title: string, index: number): LessonExercise['kind'] => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('debugging') || lowerTitle.includes('detective')) {
    return 'Debug';
  }

  if (lowerTitle.includes('congratulations') || lowerTitle.includes('celebration')) {
    return 'Challenge';
  }

  if (index % 3 === 1) {
    return 'Build';
  }

  if (index % 3 === 2) {
    return 'Challenge';
  }

  return 'Warm-up';
};

const xmlEscape = (value: string | number) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const variableId = (name: string) => `${questSlug(name) || 'value'}-id`;

const variableField = (name: string) =>
  `<field name="VAR" id="${xmlEscape(variableId(name))}">${xmlEscape(name)}</field>`;

const variablesXml = (names: string[]) =>
  names.length
    ? `<variables>${names
        .map((name) => `<variable id="${xmlEscape(variableId(name))}">${xmlEscape(name)}</variable>`)
        .join('')}</variables>`
    : '';

type BlockFactory = (next?: string) => string;

const blockXml = (type: string, content = '', next = '') =>
  `<block type="${type}">${content}${next ? `<next>${next}</next>` : ''}</block>`;

const chainBlocks = (blocks: BlockFactory[]) =>
  blocks.reduceRight((next, makeBlock) => makeBlock(next), '');

const withStartBlock = (blocks: BlockFactory[], variables: string[] = []) =>
  workspaceXml(`
    ${variablesXml(variables)}
    <block type="start_program" x="24" y="24">
      <next>
        ${chainBlocks(blocks)}
      </next>
    </block>
  `);

const textValueXml = (name: string, text: string) =>
  `<value name="${name}">
    <block type="text">
      <field name="TEXT">${xmlEscape(text)}</field>
    </block>
  </value>`;

const numberValueXml = (name: string, value: number) =>
  `<value name="${name}">
    <shadow type="math_number">
      <field name="NUM">${xmlEscape(value)}</field>
    </shadow>
  </value>`;

const variableValueXml = (name: string, variable: string) =>
  `<value name="${name}">
    <block type="variables_get">
      ${variableField(variable)}
    </block>
  </value>`;

const sayBlock = (message: string): BlockFactory => (next) =>
  blockXml('say_message', `<field name="MESSAGE">${xmlEscape(message)}</field>`, next);

const printTextBlock = (message: string): BlockFactory => (next) =>
  blockXml('text_print', textValueXml('TEXT', message), next);

const printVariableBlock = (variable: string): BlockFactory => (next) =>
  blockXml('text_print', variableValueXml('TEXT', variable), next);

const askBlock = (question: string, variable: string): BlockFactory => (next) =>
  blockXml(
    'ask_question',
    `<field name="QUESTION">${xmlEscape(question)}</field>${variableField(variable)}`,
    next,
  );

const setTextBlock = (variable: string, value: string): BlockFactory => (next) =>
  blockXml('variables_set', `${variableField(variable)}${textValueXml('VALUE', value)}`, next);

const setNumberBlock = (variable: string, value: number): BlockFactory => (next) =>
  blockXml(
    'variables_set',
    `${variableField(variable)}
    <value name="VALUE">
      <block type="math_number">
        <field name="NUM">${xmlEscape(value)}</field>
      </block>
    </value>`,
    next,
  );

const setAddBlock = (variable: string, amount: number): BlockFactory => (next) =>
  blockXml(
    'variables_set',
    `${variableField(variable)}
    <value name="VALUE">
      <block type="math_arithmetic">
        <field name="OP">ADD</field>
        ${variableValueXml('A', variable)}
        <value name="B">
          <block type="math_number">
            <field name="NUM">${xmlEscape(amount)}</field>
          </block>
        </value>
      </block>
    </value>`,
    next,
  );

const setMathBlock = (variable: string, left: number, operation: string, right: number): BlockFactory => (
  next,
) =>
  blockXml(
    'variables_set',
    `${variableField(variable)}
    <value name="VALUE">
      <block type="math_arithmetic">
        <field name="OP">${xmlEscape(operation)}</field>
        <value name="A">
          <block type="math_number">
            <field name="NUM">${xmlEscape(left)}</field>
          </block>
        </value>
        <value name="B">
          <block type="math_number">
            <field name="NUM">${xmlEscape(right)}</field>
          </block>
        </value>
      </block>
    </value>`,
    next,
  );

const compareVariableToTextXml = (variable: string, text: string, operator = 'EQ') =>
  `<block type="logic_compare">
    <field name="OP">${xmlEscape(operator)}</field>
    ${variableValueXml('A', variable)}
    ${textValueXml('B', text)}
  </block>`;

const compareVariableToNumberXml = (variable: string, number: number, operator = 'GT') =>
  `<block type="logic_compare">
    <field name="OP">${xmlEscape(operator)}</field>
    ${variableValueXml('A', variable)}
    <value name="B">
      <block type="math_number">
        <field name="NUM">${xmlEscape(number)}</field>
      </block>
    </value>
  </block>`;

const ifEqualsBlock = (variable: string, expected: string, message: string): BlockFactory => (next) =>
  blockXml(
    'control_if',
    `<value name="IF">${compareVariableToTextXml(variable, expected)}</value>
    <statement name="DO">${sayBlock(message)()}</statement>`,
    next,
  );

const ifElseEqualsBlock = (
  variable: string,
  expected: string,
  ifMessage: string,
  elseMessage: string,
): BlockFactory => (next) =>
  blockXml(
    'control_if_else',
    `<value name="IF">${compareVariableToTextXml(variable, expected)}</value>
    <statement name="DO">${sayBlock(ifMessage)()}</statement>
    <statement name="ELSE">${sayBlock(elseMessage)()}</statement>`,
    next,
  );

const repeatBlock = (times: number, blocks: BlockFactory[]): BlockFactory => (next) =>
  blockXml(
    'controls_repeat_ext',
    `${numberValueXml('TIMES', times)}
    <statement name="DO">${chainBlocks(blocks)}</statement>`,
    next,
  );

const forBlock = (variable: string, from: number, to: number, by: number, blocks: BlockFactory[]): BlockFactory => (
  next,
) =>
  blockXml(
    'controls_for',
    `${variableField(variable)}
    ${numberValueXml('FROM', from)}
    ${numberValueXml('TO', to)}
    ${numberValueXml('BY', by)}
    <statement name="DO">${chainBlocks(blocks)}</statement>`,
    next,
  );

const whileCountBlock = (variable: string, stopBefore: number): BlockFactory => (next) =>
  blockXml(
    'controls_whileUntil',
    `<field name="MODE">WHILE</field>
    <value name="BOOL">${compareVariableToNumberXml(variable, stopBefore, 'LT')}</value>
    <statement name="DO">${chainBlocks([printVariableBlock(variable), setAddBlock(variable, 1)])}</statement>`,
    next,
  );

const listBlock = (variable: string, items: string[]): BlockFactory => (next) =>
  blockXml(
    'variables_set',
    `${variableField(variable)}
    <value name="VALUE">
      <block type="lists_create_with">
        <mutation items="${xmlEscape(items.length)}"></mutation>
        ${items
          .map((item, index) => `<value name="ADD${index}">
            <block type="text">
              <field name="TEXT">${xmlEscape(item)}</field>
            </block>
          </value>`)
          .join('')}
      </block>
    </value>`,
    next,
  );

const functionBlock = (name: string, messages: string[], callCount = 1): BlockFactory[] => [
  (next) =>
    blockXml(
      'function_define_simple',
      `<field name="NAME">${xmlEscape(name)}</field>
      <statement name="DO">${chainBlocks(messages.map((message) => sayBlock(message)))}</statement>`,
      next,
    ),
  ...Array.from({ length: callCount }, () => (next?: string) =>
    blockXml('function_call_simple', `<field name="NAME">${xmlEscape(name)}</field>`, next),
  ),
];

const topicText = (title: string) => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('restaurant') || lowerTitle.includes('menu') || lowerTitle.includes('snack')) {
    return {
      noun: 'restaurant',
      variable: 'food',
      question: 'What would you like to eat?',
      answer: 'pizza',
      message: 'Welcome to the TinyPyk cafe!',
      win: 'Great choice! Your food is on its way.',
      other: 'That sounds tasty too!',
      items: ['pizza', 'wrap', 'fruit'],
    };
  }

  if (lowerTitle.includes('story') || lowerTitle.includes('haunted') || lowerTitle.includes('adventure')) {
    return {
      noun: 'story',
      variable: 'path',
      question: 'Which path should the hero choose?',
      answer: 'left',
      message: 'Once upon a tiny Python time...',
      win: 'The hero finds a bright door.',
      other: 'The hero chooses a new path.',
      items: ['hero', 'door', 'treasure'],
    };
  }

  if (lowerTitle.includes('music') || lowerTitle.includes('song') || lowerTitle.includes('drum') || lowerTitle.includes('chorus')) {
    return {
      noun: 'music',
      variable: 'song',
      question: 'Which sound should play?',
      answer: 'drum',
      message: 'TinyPyk music time!',
      win: 'The beat is ready.',
      other: 'Let us try another sound.',
      items: ['drum', 'bell', 'bass'],
    };
  }

  if (lowerTitle.includes('turtle') || lowerTitle.includes('draw') || lowerTitle.includes('shape') || lowerTitle.includes('pattern')) {
    return {
      noun: 'drawing',
      variable: 'shape',
      question: 'Which shape should we draw?',
      answer: 'square',
      message: 'Draw a friendly Python shape.',
      win: 'The shape plan is ready.',
      other: 'Try a new drawing idea.',
      items: ['square', 'star', 'road'],
    };
  }

  if (lowerTitle.includes('dice') || lowerTitle.includes('random') || lowerTitle.includes('fortune')) {
    return {
      noun: 'surprise',
      variable: 'luck',
      question: 'Pick a lucky word.',
      answer: 'star',
      message: 'A tiny surprise is coming.',
      win: 'Lucky star!',
      other: 'A new surprise appears.',
      items: ['star', 'moon', 'sun'],
    };
  }

  if (lowerTitle.includes('quiz') || lowerTitle.includes('question') || lowerTitle.includes('ask')) {
    return {
      noun: 'quiz',
      variable: 'answer',
      question: 'What is your answer?',
      answer: 'python',
      message: 'Tiny quiz time!',
      win: 'Correct answer!',
      other: 'Good try. Keep going.',
      items: ['python', 'blocks', 'stage'],
    };
  }

  if (lowerTitle.includes('hospital') || lowerTitle.includes('helper') || lowerTitle.includes('kind')) {
    return {
      noun: 'helper',
      variable: 'feeling',
      question: 'How are you feeling?',
      answer: 'happy',
      message: 'Tiny helper is ready.',
      win: 'That is lovely to hear.',
      other: 'One small step can help.',
      items: ['rest', 'water', 'smile'],
    };
  }

  if (lowerTitle.includes('debugging') || lowerTitle.includes('detective')) {
    return {
      noun: 'debugging',
      variable: 'bug',
      question: 'What did you fix?',
      answer: 'bug',
      message: 'Find the tiny bug.',
      win: 'Bug fixed!',
      other: 'Try one more check.',
      items: ['look', 'test', 'fix'],
    };
  }

  return {
    noun: title,
    variable: 'answer',
    question: `What should happen in ${title}?`,
    answer: title.split(' ')[0] || 'yes',
    message: `TinyPyk ${title} quest`,
    win: `${title} works!`,
    other: 'Try one tiny change.',
    items: [title, 'Python', 'blocks'],
  };
};

const starterXmlForQuest = (lesson: Lesson, title: string) => {
  const topic = topicText(title);
  const titleMessage = `${topic.message}`;

  switch (lesson.id) {
    case 'lesson-1':
      return withStartBlock([
        sayBlock(titleMessage),
        ...(title.toLowerCase().includes('story')
          ? [sayBlock('A cat finds a button.'), sayBlock('The button says Python!')]
          : []),
      ]);

    case 'lesson-2':
      return withStartBlock(
        [askBlock(topic.question, topic.variable), sayBlock(`Thanks for your ${topic.noun} answer!`)],
        [topic.variable],
      );

    case 'lesson-3':
      return withStartBlock(
        [setTextBlock(topic.variable, topic.answer), printVariableBlock(topic.variable)],
        [topic.variable],
      );

    case 'lesson-4':
      return withStartBlock([
        printTextBlock(titleMessage),
        printTextBlock(`Python keeps "${topic.answer}" together.`),
      ]);

    case 'lesson-5':
      return withStartBlock(
        [askBlock(topic.question, topic.variable), ifEqualsBlock(topic.variable, topic.answer, topic.win)],
        [topic.variable],
      );

    case 'lesson-6':
      return withStartBlock(
        [setMathBlock(topic.variable, 3, 'ADD', title.length % 5 + 2), printVariableBlock(topic.variable)],
        [topic.variable],
      );

    case 'lesson-7':
      return withStartBlock([repeatBlock(3, [sayBlock(topic.win)])]);

    case 'lesson-8':
      return withStartBlock([
        repeatBlock(2, [sayBlock(titleMessage), sayBlock(topic.win)]),
        sayBlock(`${topic.noun} finished!`),
      ]);

    case 'lesson-9':
      return withStartBlock(
        [askBlock(topic.question, topic.variable), ifElseEqualsBlock(topic.variable, topic.answer, topic.win, topic.other)],
        [topic.variable],
      );

    case 'lesson-10':
      return withStartBlock(
        [listBlock(`${topic.variable}s`, topic.items), printVariableBlock(`${topic.variable}s`)],
        [`${topic.variable}s`],
      );

    case 'lesson-11':
      return withStartBlock([forBlock('count', 1, 5, 1, [printVariableBlock('count')])], ['count']);

    case 'lesson-12':
      return withStartBlock(functionBlock('tiny_helper', [titleMessage, topic.win]));

    case 'lesson-13':
      return withStartBlock(
        [
          setNumberBlock('score', 8),
          (next) =>
            blockXml(
              'control_if',
              `<value name="IF">
                <block type="logic_operation">
                  <field name="OP">AND</field>
                  <value name="A">${compareVariableToNumberXml('score', 5, 'GT')}</value>
                  <value name="B">${compareVariableToNumberXml('score', 10, 'LT')}</value>
                </block>
              </value>
              <statement name="DO">${sayBlock(topic.win)()}</statement>`,
              next,
            ),
        ],
        ['score'],
      );

    case 'lesson-14':
      return withStartBlock(
        [
          setNumberBlock('score', 10),
          (next) =>
            blockXml(
              'control_if',
              `<value name="IF">${compareVariableToNumberXml('score', 6, 'GT')}</value>
              <statement name="DO">${sayBlock(topic.win)()}</statement>`,
              next,
            ),
        ],
        ['score'],
      );

    case 'lesson-15':
      return withStartBlock([setNumberBlock('count', 1), whileCountBlock('count', 4)], ['count']);

    case 'lesson-16':
      return withStartBlock(
        [
          askBlock(topic.question, topic.variable),
          ifElseEqualsBlock(topic.variable, topic.answer, topic.win, topic.other),
        ],
        [topic.variable],
      );

    case 'lesson-17':
      return withStartBlock(
        [
          sayBlock(`Final quest: ${title}`),
          askBlock(topic.question, topic.variable),
          ifElseEqualsBlock(topic.variable, topic.answer, topic.win, topic.other),
          repeatBlock(2, [sayBlock('I can improve my code!')]),
        ],
        [topic.variable],
      );

    default:
      return lesson.starterXml;
  }
};

const questCopyForTitle = (lesson: Lesson, title: string) => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('debugging') || lowerTitle.includes('detective')) {
    return {
      mission: `Find and fix one tiny problem in a ${title} quest.`,
      steps: [
        'Play the code and look carefully at the output.',
        `Check the block that uses ${lesson.concept}.`,
        'Fix one thing, then play again to prove it works.',
      ],
      successCriteria: 'The bug is fixed and you can explain what changed.',
    };
  }

  if (lowerTitle.includes('congratulations') || lowerTitle.includes('celebration')) {
    return {
      mission: `Celebrate the ${lesson.concept} idea with a tiny finished program.`,
      steps: [
        'Make the program run from the green flag.',
        'Add one friendly final message.',
        'Play it once more and mark the quest complete.',
      ],
      successCriteria: 'The quest feels finished and prints or shows a clear result.',
    };
  }

  if (lowerTitle.includes('story') || lowerTitle.includes('haunted') || lowerTitle.includes('adventure')) {
    return {
      mission: `Use ${lesson.concept} to make a short interactive story moment.`,
      steps: [
        'Choose a character, place, or problem.',
        `Use at least one block that practises ${lesson.concept}.`,
        'Press Play and improve the words so the story is easy to follow.',
      ],
      successCriteria: 'The story has a clear beginning and a visible Python result.',
    };
  }

  if (lowerTitle.includes('restaurant') || lowerTitle.includes('snack') || lowerTitle.includes('menu')) {
    return {
      mission: `Build a food or menu quest that practises ${lesson.concept}.`,
      steps: [
        'Name the food, drink, or menu choice.',
        `Use ${lesson.concept} to print, save, choose, or repeat part of the order.`,
        'Test with at least one change.',
      ],
      successCriteria: 'The food quest responds clearly and the output is readable.',
    };
  }

  if (lowerTitle.includes('music') || lowerTitle.includes('song') || lowerTitle.includes('drum') || lowerTitle.includes('chorus')) {
    return {
      mission: `Make a music quest that uses ${lesson.concept} in a pattern.`,
      steps: [
        'Choose a sound, lyric, or rhythm idea.',
        `Use ${lesson.concept} to organise the musical pattern.`,
        'Play it and change one word, number, or sound.',
      ],
      successCriteria: 'The music quest has a repeatable pattern or labelled output.',
    };
  }

  if (lowerTitle.includes('turtle') || lowerTitle.includes('draw') || lowerTitle.includes('shape') || lowerTitle.includes('pattern')) {
    return {
      mission: `Create a drawing quest that shows ${lesson.concept}.`,
      steps: [
        'Start with one small drawing or label.',
        `Use ${lesson.concept} to control the drawing idea.`,
        'Run it and improve the shape, colour, or text.',
      ],
      successCriteria: 'The drawing or drawing plan matches the Python idea.',
    };
  }

  if (lowerTitle.includes('dice') || lowerTitle.includes('random') || lowerTitle.includes('fortune')) {
    return {
      mission: `Make a surprise quest that practises ${lesson.concept}.`,
      steps: [
        'Choose what should be surprising.',
        `Use ${lesson.concept} in the code that creates or explains the surprise.`,
        'Play more than once and compare the results.',
      ],
      successCriteria: 'The quest can show a changing or choice-based result.',
    };
  }

  if (lowerTitle.includes('quiz') || lowerTitle.includes('question') || lowerTitle.includes('ask')) {
    return {
      mission: `Build a question quest using ${lesson.concept}.`,
      steps: [
        'Write one clear question.',
        `Use ${lesson.concept} to handle the answer or response.`,
        'Test the quest and make the feedback kinder or clearer.',
      ],
      successCriteria: 'The learner can answer and see a useful response.',
    };
  }

  if (lowerTitle.includes('hospital') || lowerTitle.includes('helper') || lowerTitle.includes('kind')) {
    return {
      mission: `Make a caring helper quest with ${lesson.concept}.`,
      steps: [
        'Choose a safe, friendly helper idea.',
        `Use ${lesson.concept} to create the helper response.`,
        'Check that the words are kind and age-appropriate.',
      ],
      successCriteria: 'The helper quest gives a safe and friendly output.',
    };
  }

  return {
    mission: `Use ${lesson.concept} to build the ${title} quest.`,
    steps: [
      `Choose the idea for ${title}.`,
      `Snap blocks that use ${lesson.concept}.`,
      'Press Play, read the output, and improve one thing.',
    ],
    successCriteria: `The ${title} quest runs and shows the ${lesson.concept} idea clearly.`,
  };
};

const makeQuestExercise = (lesson: Lesson, title: string, index: number): LessonExercise => {
  const questCopy = questCopyForTitle(lesson, title);

  return {
    id: `${lesson.id}-quest-${questSlug(title) || index + 1}`,
    title,
    kind: questKind(title, index),
    starterXml: starterXmlForQuest(lesson, title),
    ...questCopy,
  };
};

const getLessonExercises = (lesson: Lesson) => {
  const baseExercises = (lessonExercises[lesson.id] ?? []).map((exercise, index) => ({
    ...exercise,
    starterXml: exercise.starterXml ?? starterXmlForQuest(lesson, exercise.title || lesson.title),
    kind: exercise.kind ?? questKind(exercise.title, index),
  }));
  const existingTitles = new Set(baseExercises.map((exercise) => exercise.title.toLowerCase()));
  const questTitles = [
    ...(hedyStyleQuestTitles[lesson.id] ?? []),
    ...(extraTinyPykQuestTitles[lesson.id] ?? []),
  ];
  const extraExercises = questTitles
    .filter((title, index) => {
      const normalizedTitle = title.toLowerCase();

      return !existingTitles.has(normalizedTitle) && questTitles.findIndex((questTitle) => questTitle.toLowerCase() === normalizedTitle) === index;
    })
    .map((title, index) => makeQuestExercise(lesson, title, index));

  return [...baseExercises, ...extraExercises];
};

export const lessons: Lesson[] = baseLessons.map((lesson) => ({
  ...lesson,
  exercises: getLessonExercises(lesson),
}));

export const firstLesson = lessons[0];

export const learningTracks: LearningTrack[] = [
  {
    id: 'print-input',
    title: 'Print and Input',
    focus: 'Start with print(), input(), variables, strings, and conditions.',
    lessonIds: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5'],
  },
  {
    id: 'loops-lists',
    title: 'Loops, Lists, and Functions',
    focus: 'Build real Python flow with maths, loops, indentation, lists, for loops, and functions.',
    lessonIds: ['lesson-6', 'lesson-7', 'lesson-8', 'lesson-9', 'lesson-10', 'lesson-11', 'lesson-12'],
  },
  {
    id: 'data-science',
    title: 'Data Science',
    focus: 'Combine rules, compare values, repeat while conditions hold, tell a data story, and finish a project.',
    lessonIds: ['lesson-13', 'lesson-14', 'lesson-15', 'lesson-16', 'lesson-17'],
  },
];

export const projectPaths: ProjectPath[] = [
  {
    id: 'foundation',
    title: 'Foundation',
    label: 'Start here',
    focus: 'Print, ask, save, quote, and make the first Python choice.',
    description: 'Begin like Hedy: one small language idea at a time, starting with real print() output.',
    lessonIds: ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5'],
    accent: '#fff1a8',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    label: 'Next steps',
    focus: 'Maths, loops, indentation, if/else, lists, for loops, and functions.',
    description: 'Grow from single commands into structured Python programs with repeated and indented code.',
    lessonIds: ['lesson-6', 'lesson-7', 'lesson-8', 'lesson-9', 'lesson-10', 'lesson-11', 'lesson-12'],
    accent: '#c9ebff',
  },
  {
    id: 'data-science',
    title: 'Data Science',
    label: 'Data stories',
    focus: 'Combine conditions, compare values, use while, build data stories, and finish a capstone.',
    description: 'Use Python to ask questions, sort answers, explain simple patterns, and complete a safe final project.',
    lessonIds: ['lesson-13', 'lesson-14', 'lesson-15', 'lesson-16', 'lesson-17'],
    accent: '#d6f7c8',
  },
];
