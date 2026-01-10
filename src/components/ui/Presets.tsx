export const ButtonStyle = `
  px-2.5 py-1 rounded flex items-center justify-center
  min-w-[2.5rem] max-w-full
  gap-1 sm:gap-2
  select-none transition duration-150 ease-in-out
  text-black dark:text-white
  invert-30
  data-hover:invert-0 data-hover:scale-110 
  data-hover:data-active:scale-95
  cursor-pointer data-disabled:cursor-not-allowed data-disabled:invert-70
  sm:px-2 sm:py-1.5 md:px-2.5 md:py-2
`;

export const InputStyle = `
  px-1 py-2 text-xs sm:text-sm
  text-black dark:text-white
  bg-gray-200 dark:bg-zinc-700
  border border-gray-400 dark:border-zinc-600
  rounded
  w-full sm:w-auto
  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
  transition
  focus:outline-none focus:ring-2 focus:ring-zinc-500
  cursor-pointer disabled:cursor-not-allowed
  disabled:text-gray-600 dark:disabled:text-zinc-300
  sm:px-1 sm:py-1.5 md:px-1 md:py-2
`;

export const SpanStyle = `
  text-xs sm:text-sm md:text-base
  text-black dark:text-zinc-200
  disabled:text-gray-400 dark:disabled:text-gray-200
  select-text
  truncate
  max-w-[4rem] sm:max-w-xs md:max-w-sm lg:max-w-md
  hidden xs:inline sm:inline
`;
