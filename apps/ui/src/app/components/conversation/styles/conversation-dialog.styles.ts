export const CONVERSATION_DIALOG_STYLES = {
  container: {
    user: 'bg-gray-50 dark:bg-transparent',
    none: 'bg-transparent border-b border-border',
    assistant: 'bg-blue-50 dark:bg-gray-900'
  },
  icon: {
    wrapper: {
      assistant: 'bg-purple-100 dark:bg-purple-900',
      none: 'bg-gray-200 dark:bg-gray-700',
      user: 'bg-gray-200 dark:bg-gray-700'
    },
    base: 'p-2 mr-3 rounded-full w-10 h-10',
    icon: {
      assistant: 'text-purple-600 dark:text-purple-300 p-0 m-0',
      none: 'w-5 h-5 text-blue-600 dark:text-blue-300',
      user: 'w-5 h-5 text-blue-600 dark:text-blue-300'
    }
  }
} as const; 