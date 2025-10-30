import {clsx, type ClassValue} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  value?: string | Date | null,
  options: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'long', year: 'numeric'},
) {
  if (!value) {
    return ''
  }

  try {
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return new Intl.DateTimeFormat('uk-UA', options).format(date)
  } catch {
    return ''
  }
}
