export const scratchPalette = {
  events: '#ffbf00',
  motion: '#4c97ff',
  looks: '#9966ff',
  sound: '#cf63cf',
  control: '#ffab19',
  sensing: '#5cb1d6',
  operators: '#59c059',
  variables: '#ff8c1a',
  myBlocks: '#ff6680',
  extensions: '#707070',
  advanced: '#004047',
  arrays: '#e05a24',
  text: '#b8860b',
  game: '#00884a',
  repository: '#3154c9',
} as const;

export const scratchBlockStyles = {
  events: {
    colourPrimary: scratchPalette.events,
    colourSecondary: '#e6ac00',
    colourTertiary: '#cc9900',
  },
  motion: {
    colourPrimary: scratchPalette.motion,
    colourSecondary: '#4280d7',
    colourTertiary: '#3373cc',
  },
  looks: {
    colourPrimary: scratchPalette.looks,
    colourSecondary: '#855cd6',
    colourTertiary: '#774dcb',
  },
  sound: {
    colourPrimary: scratchPalette.sound,
    colourSecondary: '#c94fc9',
    colourTertiary: '#bd42bd',
  },
  control: {
    colourPrimary: scratchPalette.control,
    colourSecondary: '#ec9c13',
    colourTertiary: '#cf8b17',
  },
  sensing: {
    colourPrimary: scratchPalette.sensing,
    colourSecondary: '#47a8d1',
    colourTertiary: '#2e8eb8',
  },
  operators: {
    colourPrimary: scratchPalette.operators,
    colourSecondary: '#46b946',
    colourTertiary: '#389438',
  },
  variables: {
    colourPrimary: scratchPalette.variables,
    colourSecondary: '#ff8000',
    colourTertiary: '#db6e00',
  },
  myBlocks: {
    colourPrimary: scratchPalette.myBlocks,
    colourSecondary: '#ff4d6a',
    colourTertiary: '#ff3355',
  },
} as const;
