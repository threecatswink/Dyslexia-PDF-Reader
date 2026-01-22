export const ButtonStyle = `
  inline-flex items-center justify-center gap-2
  rounded-lg px-2 py-2 text-sm font-medium
  bg-zinc-100 dark:bg-zinc-700/60
  text-zinc-900 dark:text-zinc-50
  border border-zinc-300/80 dark:border-zinc-600
  shadow-lg dark:shadow-lg
  transition duration-150 ease-out
  hover:bg-white dark:hover:bg-zinc-600/90
  hover:border-zinc-400 dark:hover:border-zinc-500
  hover:scale-105
  hover:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.8)]
  disabled:hover:bg-zinc-100 dark:disabled:hover:bg-zinc-700/60
  disabled:hover:border-zinc-300/80 dark:disabled:hover:border-zinc-600
  disabled:hover:scale-100
  disabled:hover:shadow-none
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400
  focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-800
  disabled:active:scale-100
  active:scale-95
  disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0
  cursor-pointer disabled:cursor-not-allowed
  min-w-[2.5rem] max-w-full select-none group
  forced-colors:bg-[ButtonFace] forced-colors:text-[ButtonText] 
  forced-colors:border-[ButtonBorder] forced-colors:border-2
  forced-colors:disabled:text-[GrayText] forced-colors:disabled:border-[GrayText]
  forced-colors:hover:not-disabled:border-[Highlight] forced-colors:hover:not-disabled:bg-[Highlight] forced-colors:hover:not-disabled:text-[HighlightText]
  forced-colors:focus-visible:outline forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-[Highlight]
`;

export const SVGStyle = `
  transition
  invert-10
  group-hover:invert-0
  dark:group-hover:invert-0
  group-data-[disabled]:opacity-50
  forced-colors:fill-[ButtonText] forced-colors:stroke-[ButtonText]
  forced-colors:group-data-[disabled]:fill-[GrayText] forced-colors:group-data-[disabled]:stroke-[GrayText]
`;

export const InputStyle = `
  w-full sm:w-auto rounded-lg px-2 py-2 text-sm leading-tight
  bg-zinc-100 dark:bg-zinc-800
  min-h-[2.65rem]
  text-zinc-950 dark:text-zinc-50
  border border-zinc-300/80 dark:border-zinc-600
  shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_0_rgba(0,0,0,0.35)]
  placeholder:text-zinc-500 dark:placeholder:text-zinc-400
  transition duration-150 ease-out
  hover:bg-white dark:hover:bg-zinc-700
  hover:border-zinc-400 dark:hover:border-zinc-500
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400
  focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-800
  disabled:bg-zinc-200 disabled:text-zinc-900 disabled:shadow-none
  disabled:border-zinc-300/80 dark:disabled:border-zinc-600
  dark:disabled:bg-zinc-700 dark:disabled:text-zinc-100
  cursor-text disabled:cursor-not-allowed
  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
  sm:px-2 sm:py-2 sm:min-h-[2.65rem]
  md:px-2 md:py-2 md:min-h-[2.65rem]
  forced-colors:bg-[Field] forced-colors:text-[FieldText]
  forced-colors:border-[FieldText] forced-colors:border-2
  forced-colors:disabled:text-[GrayText] forced-colors:disabled:border-[GrayText]
  forced-colors:focus-visible:outline forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-[Highlight]
`;

export const SpanStyle = `
  inline-flex items-center
  text-xs sm:text-sm md:text-sm lg:text-base
  leading-tight font-medium
  text-zinc-900 dark:text-zinc-100
  disabled:text-zinc-400 dark:disabled:text-zinc-500
  select-text whitespace-nowrap truncate
  max-w-[8rem] sm:max-w-[10rem] md:max-w-[12rem]
  forced-colors:text-[CanvasText]
  forced-colors:disabled:text-[GrayText]
`;

export const SettingsSpanStyle = `
  inline-flex items-center
  text-xs leading-tight font-medium
  text-zinc-900 dark:text-zinc-100
  disabled:text-zinc-400 dark:disabled:text-zinc-500
  select-text whitespace-nowrap truncate
  forced-colors:text-[CanvasText]
  forced-colors:disabled:text-[GrayText]
`;

export const SwitchStyle = `
  group relative flex h-6 w-12 cursor-pointer rounded-full bg-red-700 p-1 ease-in-out
  transition duration-150 ease-out ring-2 ring-inset ring-zinc-400 dark:ring-zinc-600
  hover:ring-2 hover:ring-zinc-500 dark:hover:ring-zinc-500
  hover:brightness-105 dark:hover:brightness-110
  focus:not-data-focus:outline-none data-checked:bg-green-700 data-focus:outline data-focus:outline-offset-2 data-focus:outline-zinc-900 dark:data-focus:outline-white
  forced-colors:bg-[ButtonFace] forced-colors:border-2 forced-colors:border-[ButtonText]
  forced-colors:data-checked:bg-[Highlight] forced-colors:data-checked:border-[Highlight]
  forced-colors:data-focus:outline forced-colors:data-focus:outline-2 forced-colors:data-focus:outline-[Highlight]
`;

export const SwitchKnobStyle = `
  pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white 
  shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-6
  forced-colors:bg-[ButtonText] forced-colors:border-2 forced-colors:border-[ButtonText]
  forced-colors:group-data-checked:bg-[HighlightText]
`;
