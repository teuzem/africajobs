import React from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/solid'

interface FAQItem {
  question: string
  answer: string
}

interface AuthFAQProps {
  items: FAQItem[]
}

export function AuthFAQ({ items }: AuthFAQProps) {
  return (
    <div className="w-full pt-16">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-2">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Questions Fréquentes</h3>
        {items.map((item, index) => (
          <Disclosure key={index} as="div" className="mt-2">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-3 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                  <span>{item.question}</span>
                  <ChevronUpIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-blue-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-600">
                  {item.answer}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  )
}
