import * as Blockly from 'blockly/core';
import { tinypykBlocklyTheme } from './theme';
import { toolbox } from './toolbox';

export const workspaceConfig: Blockly.BlocklyOptions = {
  toolbox,
  theme: tinypykBlocklyTheme,
  trashcan: true,
  scrollbars: true,
  sounds: false,
  renderer: 'zelos',
  move: {
    scrollbars: true,
    drag: true,
    wheel: true,
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.9,
    maxScale: 1.4,
    minScale: 0.5,
    scaleSpeed: 1.1,
  },
  grid: {
    spacing: 24,
    length: 3,
    colour: '#d8e7ec',
    snap: true,
  },
};
