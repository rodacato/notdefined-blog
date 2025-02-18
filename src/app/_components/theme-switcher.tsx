'use client'

import { useEffect, useState } from 'react'
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa'

type ColorSchemePreference = 'system' | 'dark' | 'light'

const STORAGE_KEY = 'nextjs-blog-starter-theme'
const modes: ColorSchemePreference[] = ['system', 'dark', 'light']

declare global {
  var updateDOM: () => void
}

/** Script para evitar FOUC (Flash of Unstyled Content) */
export const NoFOUCScript = (storageKey: string) => {
  const [SYSTEM, DARK, LIGHT] = ['system', 'dark', 'light']

  const modifyTransition = () => {
    const css = document.createElement('style')
    css.textContent = '*,*:after,*:before{transition:none !important;}'
    document.head.appendChild(css)

    return () => {
      getComputedStyle(document.body)
      setTimeout(() => document.head.removeChild(css), 1)
    }
  }

  const media = matchMedia(`(prefers-color-scheme: ${DARK})`)

  window.updateDOM = () => {
    const restoreTransitions = modifyTransition()
    const mode = localStorage.getItem(storageKey) ?? SYSTEM
    const systemMode = media.matches ? DARK : LIGHT
    const resolvedMode = mode === SYSTEM ? systemMode : mode
    const classList = document.documentElement.classList
    if (resolvedMode === DARK) classList.add(DARK)
    else classList.remove(DARK)
    document.documentElement.setAttribute('data-mode', mode)
    restoreTransitions()
  }
  window.updateDOM()
  media.addEventListener('change', window.updateDOM)
}

let updateDOM: () => void

const Switch = () => {
  const [mode, setMode] = useState<ColorSchemePreference>(
    () =>
      ((typeof localStorage !== 'undefined' &&
        localStorage.getItem(STORAGE_KEY)) ??
        'system') as ColorSchemePreference
  )

  useEffect(() => {
    updateDOM = window.updateDOM
    addEventListener('storage', (e: StorageEvent): void => {
      e.key === STORAGE_KEY && setMode(e.newValue as ColorSchemePreference)
    })
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    updateDOM()
  }, [mode])

  const handleModeSwitch = () => {
    const index = modes.indexOf(mode)
    setMode(modes[(index + 1) % modes.length])
  }

  return (
    <button
      suppressHydrationWarning
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      onClick={handleModeSwitch}
    >
      {mode === 'dark' ? (
        <>
          <FaMoon className="text-yellow-400" />
          <span className="hidden md:inline">Modo Oscuro</span>
        </>
      ) : mode === 'light' ? (
        <>
          <FaSun className="text-yellow-500" />
          <span className="hidden md:inline">Modo Claro</span>
        </>
      ) : (
        <>
          <FaDesktop className="text-gray-500" />
          <span className="hidden md:inline">Automático</span>
        </>
      )}
    </button>
  )
}

export const ThemeSwitcher = () => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(${NoFOUCScript.toString()})('${STORAGE_KEY}')`
        }}
      />
      <Switch />
    </>
  )
}
