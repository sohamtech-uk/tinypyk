import * as Blockly from 'blockly/core';
import { scratchPalette } from './scratchPalette';

export const toolbox: Blockly.utils.toolbox.ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Events',
      colour: scratchPalette.events,
      contents: [
        { kind: 'block', type: 'start_program' },
      ],
    },
    {
      kind: 'category',
      name: 'Motion',
      colour: scratchPalette.motion,
      contents: [
        { kind: 'block', type: 'turtle_create' },
        {
          kind: 'block',
          type: 'turtle_forward',
          inputs: { DISTANCE: { shadow: { type: 'math_number', fields: { NUM: 100 } } } },
        },
        {
          kind: 'block',
          type: 'turtle_backward',
          inputs: { DISTANCE: { shadow: { type: 'math_number', fields: { NUM: 50 } } } },
        },
        {
          kind: 'block',
          type: 'turtle_left',
          inputs: { ANGLE: { shadow: { type: 'math_number', fields: { NUM: 90 } } } },
        },
        {
          kind: 'block',
          type: 'turtle_right',
          inputs: { ANGLE: { shadow: { type: 'math_number', fields: { NUM: 90 } } } },
        },
        { kind: 'block', type: 'turtle_colour' },
        { kind: 'block', type: 'turtle_pen_up' },
        { kind: 'block', type: 'turtle_pen_down' },
      ],
    },
    {
      kind: 'category',
      name: 'Looks',
      colour: scratchPalette.looks,
      contents: [
        { kind: 'block', type: 'say_message' },
        { kind: 'block', type: 'character_say' },
        { kind: 'block', type: 'character_cheer' },
        { kind: 'block', type: 'character_jump' },
      ],
    },
    {
      kind: 'category',
      name: 'Sound',
      colour: scratchPalette.sound,
      contents: [
        { kind: 'block', type: 'music_play' },
        {
          kind: 'block',
          type: 'music_rest',
          inputs: { SECONDS: { shadow: { type: 'math_number', fields: { NUM: 0.5 } } } },
        },
      ],
    },
    {
      kind: 'category',
      name: 'Control',
      colour: scratchPalette.control,
      contents: [
        {
          kind: 'block',
          type: 'control_if',
          inputs: { IF: { shadow: { type: 'logic_boolean', fields: { BOOL: 'TRUE' } } } },
        },
        {
          kind: 'block',
          type: 'control_if_else',
          inputs: { IF: { shadow: { type: 'logic_boolean', fields: { BOOL: 'TRUE' } } } },
        },
        {
          kind: 'block',
          type: 'control_nested_if',
          inputs: {
            OUTER_IF: { shadow: { type: 'logic_boolean', fields: { BOOL: 'TRUE' } } },
            INNER_IF: { shadow: { type: 'logic_boolean', fields: { BOOL: 'TRUE' } } },
          },
        },
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 4 } } } },
        },
        {
          kind: 'block',
          type: 'controls_for',
          inputs: {
            FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            TO: { shadow: { type: 'math_number', fields: { NUM: 5 } } },
            BY: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
          },
        },
        { kind: 'block', type: 'controls_whileUntil' },
      ],
    },
    {
      kind: 'category',
      name: 'Sensing',
      colour: scratchPalette.sensing,
      contents: [
        { kind: 'block', type: 'ask_question' },
      ],
    },
    {
      kind: 'category',
      name: 'Operators',
      colour: scratchPalette.operators,
      contents: [
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        {
          kind: 'block',
          type: 'math_random_int',
          inputs: {
            FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
            TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
          },
        },
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_print' },
        { kind: 'block', type: 'lists_create_with' },
        { kind: 'block', type: 'lists_length' },
        { kind: 'block', type: 'lists_getIndex' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: scratchPalette.variables,
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: 'My Blocks',
      colour: scratchPalette.myBlocks,
      contents: [
        { kind: 'block', type: 'function_define_simple' },
        { kind: 'block', type: 'function_call_simple' },
      ],
    },
    {
      kind: 'category',
      name: 'Extensions',
      colour: scratchPalette.extensions,
      categorystyle: 'extensions_category',
      contents: [
        {
          kind: 'button',
          text: 'Choose an Extension',
          callbackkey: 'OPEN_EXTENSIONS',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Advanced',
      colour: scratchPalette.advanced,
      categorystyle: 'advanced_category',
      contents: [
        {
          kind: 'category',
          name: 'Functions',
          colour: scratchPalette.myBlocks,
          categorystyle: 'procedure_category',
          contents: [
            { kind: 'block', type: 'function_define_simple' },
            { kind: 'block', type: 'function_call_simple' },
          ],
        },
        {
          kind: 'category',
          name: 'Arrays',
          colour: scratchPalette.arrays,
          categorystyle: 'arrays_category',
          contents: [
            { kind: 'block', type: 'lists_create_with' },
            { kind: 'block', type: 'lists_length' },
            { kind: 'block', type: 'lists_getIndex' },
          ],
        },
        {
          kind: 'category',
          name: 'Text',
          colour: scratchPalette.text,
          categorystyle: 'text_category',
          contents: [
            { kind: 'block', type: 'text' },
            { kind: 'block', type: 'text_join' },
            { kind: 'block', type: 'text_length' },
            { kind: 'block', type: 'text_print' },
          ],
        },
        {
          kind: 'category',
          name: 'Game',
          colour: scratchPalette.game,
          categorystyle: 'game_category',
          contents: [
            { kind: 'block', type: 'character_say' },
            { kind: 'block', type: 'character_cheer' },
            { kind: 'block', type: 'character_jump' },
            { kind: 'block', type: 'music_play' },
          ],
        },
        {
          kind: 'category',
          name: 'Repository',
          colour: scratchPalette.repository,
          categorystyle: 'repository_category',
          contents: [
            {
              kind: 'button',
              text: 'Create / add to repository',
              callbackkey: 'OPEN_REPOSITORY',
            },
          ],
        },
      ],
    },
  ],
};
