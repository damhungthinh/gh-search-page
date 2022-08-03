import { useState, MouseEvent, useContext, useMemo, memo } from 'react'
import { Settings, LightMode, DarkMode, Brightness4 } from '@mui/icons-material'
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Button
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router'
import { ThemeModeContext } from '@components/providers/ThemeModeProvider'

const NavMenu = () => {
  const navigate = useNavigate()
  const { theme, switchTheme } = useContext(ThemeModeContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { pathname } = useLocation()
  const open = !!anchorEl

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const currentPath = useMemo(() => {
    const paths = pathname.split('/').filter(Boolean)
    if (!paths.length) {
      return 'home'
    }
    if (paths[0] === 'liked') {
      return 'favourite'
    }
  }, [pathname])

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    currentPath === 'favourite' ? navigate('/') : navigate('/liked')
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        {currentPath !== 'home' && (
          <Button variant="text" href="/liked" onClick={handleNavigate}>
            Home
          </Button>
        )}
        {currentPath !== 'favourite' && (
          <Button variant="text" href="/liked" onClick={handleNavigate}>
            Favourite
          </Button>
        )}
        <Tooltip title="Settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'settings-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}>
            <Avatar sx={{ width: 32, height: 32 }}>
              <Settings />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="settings-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem disabled>
          <Typography textTransform="uppercase" fontSize="small" fontWeight="bold">
            mode
          </Typography>
        </MenuItem>
        <MenuItem selected={theme === 'light'} onClick={() => switchTheme('light')}>
          <ListItemIcon>
            <LightMode fontSize="small" />
          </ListItemIcon>
          Light
        </MenuItem>
        <MenuItem selected={theme === 'dark'} onClick={() => switchTheme('dark')}>
          <ListItemIcon>
            <DarkMode fontSize="small" />
          </ListItemIcon>
          Dark
        </MenuItem>
        <MenuItem selected={theme === 'system'} onClick={() => switchTheme('system')}>
          <ListItemIcon>
            <Brightness4 fontSize="small" />
          </ListItemIcon>
          System
        </MenuItem>
      </Menu>
    </>
  )
}

export default memo(NavMenu, () => true)
