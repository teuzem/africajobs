import React, { useState, useRef, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

interface MultiSelectProps<T> {
  options: T[]
  selectedOptions: T[]
  onChange: (selected: T[]) => void
  labelKey: keyof T
  valueKey: keyof T
  placeholder?: string
}

export function MultiSelect<T>({
  options,
  selectedOptions,
  onChange,
  labelKey,
  valueKey,
  placeholder = 'Select options',
}: MultiSelectProps<T>) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(
    (option) =>
      (option[labelKey] as string).toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedOptions.some((selected) => selected[valueKey] === option[valueKey])
  )

  const handleSelect = (option: T) => {
    onChange([...selectedOptions, option])
    setInputValue('')
    setIsOpen(false)
  }

  const handleRemove = (optionToRemove: T) => {
    onChange(selectedOptions.filter((option) => option[valueKey] !== optionToRemove[valueKey]))
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white">
        {selectedOptions.map((option) => (
          <div
            key={String(option[valueKey])}
            className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full"
          >
            {String(option[labelKey])}
            <button
              type="button"
              onClick={() => handleRemove(option)}
              className="text-blue-600 hover:text-blue-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          className="flex-grow p-1 outline-none bg-transparent"
        />
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={String(option[valueKey])}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {String(option[labelKey])}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">Aucune option trouvée</li>
          )}
        </ul>
      )}
    </div>
  )
}
