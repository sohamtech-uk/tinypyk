import { Names } from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

const quote = (value: string) => JSON.stringify(value);
let registered = false;

const toPythonName = (value: string) => {
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[0-9]+/, '');

  return cleaned || 'helper';
};

const statementOrPass = (
  block: Parameters<typeof pythonGenerator.statementToCode>[0],
  generator: typeof pythonGenerator,
  inputName: string,
) => generator.statementToCode(block, inputName) || `${generator.INDENT}pass\n`;

export function registerPythonGenerators() {
  if (registered) {
    return;
  }

  registered = true;

  pythonGenerator.forBlock.start_program = () => '';

  pythonGenerator.forBlock.turtle_create = () => 'import turtle\nt = turtle.Turtle()\n';

  pythonGenerator.forBlock.turtle_forward = (block, generator) =>
    `t.forward(${generator.valueToCode(block, 'DISTANCE', Order.NONE) || 0})\n`;

  pythonGenerator.forBlock.turtle_backward = (block, generator) =>
    `t.backward(${generator.valueToCode(block, 'DISTANCE', Order.NONE) || 0})\n`;

  pythonGenerator.forBlock.turtle_left = (block, generator) =>
    `t.left(${generator.valueToCode(block, 'ANGLE', Order.NONE) || 0})\n`;

  pythonGenerator.forBlock.turtle_right = (block, generator) =>
    `t.right(${generator.valueToCode(block, 'ANGLE', Order.NONE) || 0})\n`;

  pythonGenerator.forBlock.turtle_colour = (block) =>
    `t.color(${quote(block.getFieldValue('COLOUR') || 'black')})\n`;

  pythonGenerator.forBlock.turtle_pen_up = () => 't.penup()\n';

  pythonGenerator.forBlock.turtle_pen_down = () => 't.pendown()\n';

  pythonGenerator.forBlock.character_say = (block) =>
    `print(${quote(block.getFieldValue('MESSAGE') || '')})\n`;

  pythonGenerator.forBlock.character_cheer = () => 'print("Great job!")\n';

  pythonGenerator.forBlock.character_jump = () => 'print("Jump!")\n';

  pythonGenerator.forBlock.say_message = (block) =>
    `print(${quote(block.getFieldValue('MESSAGE') || '')})\n`;

  pythonGenerator.forBlock.ask_question = (block, generator) => {
    const variable = generator.nameDB_?.getName(
      block.getFieldValue('VAR'),
      Names.NameType.VARIABLE,
    );
    return `${variable || 'answer'} = input(${quote(block.getFieldValue('QUESTION') || '')})\n`;
  };

  pythonGenerator.forBlock.control_if = (block, generator) => {
    const condition = generator.valueToCode(block, 'IF', Order.NONE) || 'False';
    const body = statementOrPass(block, generator, 'DO');

    return `if ${condition}:\n${body}`;
  };

  pythonGenerator.forBlock.control_if_else = (block, generator) => {
    const condition = generator.valueToCode(block, 'IF', Order.NONE) || 'False';
    const body = statementOrPass(block, generator, 'DO');
    const elseBody = statementOrPass(block, generator, 'ELSE');

    return `if ${condition}:\n${body}else:\n${elseBody}`;
  };

  pythonGenerator.forBlock.control_nested_if = (block, generator) => {
    const outerCondition = generator.valueToCode(block, 'OUTER_IF', Order.NONE) || 'False';
    const innerCondition = generator.valueToCode(block, 'INNER_IF', Order.NONE) || 'False';
    const outerBody = generator.statementToCode(block, 'OUTER_DO');
    const innerBody = statementOrPass(block, generator, 'INNER_DO');
    const innerIf = `if ${innerCondition}:\n${innerBody}`;
    const nestedBody = `${outerBody}${generator.prefixLines(innerIf, generator.INDENT)}`;

    return `if ${outerCondition}:\n${nestedBody || `${generator.INDENT}pass\n`}`;
  };

  pythonGenerator.forBlock.music_play = (block) =>
    `play_sound(${quote(block.getFieldValue('SOUND') || 'Drum Beat')})\n`;

  pythonGenerator.forBlock.music_rest = (block, generator) =>
    `rest(${generator.valueToCode(block, 'SECONDS', Order.NONE) || 0.5})\n`;

  pythonGenerator.forBlock.function_define_simple = (block, generator) => {
    const name = toPythonName(block.getFieldValue('NAME') || 'helper');
    const body = generator.statementToCode(block, 'DO') || '  pass\n';

    return `def ${name}():\n${body}\n`;
  };

  pythonGenerator.forBlock.function_call_simple = (block) =>
    `${toPythonName(block.getFieldValue('NAME') || 'helper')}()\n`;
}

export { Order, pythonGenerator };
