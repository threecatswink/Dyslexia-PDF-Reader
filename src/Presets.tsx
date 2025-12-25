export const ButtonStyle = `
    px-2.5 py-2.5 rounded flex items-center max-w-full min-w-10 justify-center
    select-none transition duration-150 ease-in-out
    color-black dark:color-white
    invert-30
    data-hover:invert-0 data-hover:scale-110 
    data-hover:data-active:scale-95
    cursor-pointer data-disabled:cursor-not-allowed data-disabled:invert-70
`;

export const InputStyle = `
    px-1 py-1 text-sm 
    text-black dark:text-white
    bg-gray-200 dark:bg-zinc-700
    border border-gray-400 dark:border-zinc-600
    rounded
    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
    transition
    focus:outline-none focus:ring-2 focus:ring-zinc-500
    cursor-pointer disabled:cursor-not-allowed
    disabled:text-gray-600 dark:disabled:text-zinc-300
`;

export const SpanStyle = `
    text-black dark:text-zinc-200
    disabled:text-gray-400 dark:disabled:text-gray-200
    select-text max-w-xs md:max-w-sm lg:max-w-md truncate
`;
