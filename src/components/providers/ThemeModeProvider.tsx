import { createContext, FunctionComponent, useMemo, useState } from 'react'

import { PaletteMode, useMediaQuery } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

type ThemeMode = 'light' | 'dark' | 'system'

type ThemeModeContextProps = {
  theme: ThemeMode
  switchTheme: (theme: ThemeMode) => void
}

export const ThemeModeContext = createContext({
  theme: 'system',
  switchTheme: (theme: ThemeMode) => {}
})

export const ThemeModeProvider: FunctionComponent<any> = (props) => {
  const { children } = props
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const themeContextValue = useMemo<ThemeModeContextProps>(
    () => ({
      theme: themeMode,
      switchTheme: (theme: ThemeMode) => setThemeMode(theme)
    }),
    [themeMode]
  )

  const theme = useMemo(() => {
    let mode: PaletteMode

    switch (themeMode) {
      case 'dark':
        mode = 'dark'
        break
      case 'light':
        mode = 'light'
        break
      default:
        mode = prefersDarkMode ? 'dark' : 'light'
        break
    }

    return createTheme({
      palette: {
        mode
      }
    })
  }, [prefersDarkMode, themeMode])

  return (
    <ThemeModeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
