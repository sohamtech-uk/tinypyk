import * as Blockly from 'blockly/core';
import { scratchBlockStyles, scratchPalette } from './scratchPalette';

export const tinypykBlocklyTheme = Blockly.Theme.defineTheme('tinypyk-scratch', {
  name: 'tinypyk-scratch',
  base: Blockly.Themes.Zelos,
  blockStyles: {
    colour_blocks: scratchBlockStyles.looks,
    list_blocks: scratchBlockStyles.operators,
    logic_blocks: scratchBlockStyles.operators,
    loop_blocks: scratchBlockStyles.control,
    math_blocks: scratchBlockStyles.operators,
    procedure_blocks: scratchBlockStyles.myBlocks,
    text_blocks: scratchBlockStyles.operators,
    variable_blocks: scratchBlockStyles.variables,
    variable_dynamic_blocks: scratchBlockStyles.variables,
    hat_blocks: {
      ...scratchBlockStyles.events,
      hat: 'cap',
    },
  },
  categoryStyles: {
    event_category: { colour: scratchPalette.events },
    motion_category: { colour: scratchPalette.motion },
    looks_category: { colour: scratchPalette.looks },
    sound_category: { colour: scratchPalette.sound },
    control_category: { colour: scratchPalette.control },
    sensing_category: { colour: scratchPalette.sensing },
    operator_category: { colour: scratchPalette.operators },
    variable_category: { colour: scratchPalette.variables },
    procedure_category: { colour: scratchPalette.myBlocks },
    extensions_category: { colour: scratchPalette.extensions },
    advanced_category: { colour: scratchPalette.advanced },
    arrays_category: { colour: scratchPalette.arrays },
    text_category: { colour: scratchPalette.text },
    game_category: { colour: scratchPalette.game },
    repository_category: { colour: scratchPalette.repository },
  },
});
