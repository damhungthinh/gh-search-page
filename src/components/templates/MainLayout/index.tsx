import { useSelector } from 'react-redux'
import { Outlet } from 'react-router'
import { Alert, Container, Grid, Snackbar, Typography } from '@mui/material'
import { NavMenu } from '@components/organisms'
import { useDispatch } from 'react-redux'
import { Dispatch, RootState } from '@redux/index'
import { useCallback } from 'react'

export const MainLayout = () => {
  const dispatch = useDispatch<Dispatch>()
  const { type, message } = useSelector((state: RootState) => state.snackbar)

  const handleCloseSnackbar = useCallback(() => {
    dispatch.snackbar.closeSnackbar()
  }, [dispatch])

  return (
    <Container>
      <Snackbar open={!!type} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={type || 'success'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <Grid container flexDirection="column" rowGap="20px" minHeight="100vh">
        <Grid container alignItems="center" height={60}>
          <Grid item flex={1}>
            <Typography variant="h4">Github Search</Typography>
          </Grid>
          <Grid item xs="auto">
            <NavMenu />
          </Grid>
        </Grid>
        <Grid container flex={1}>
          <Grid item flex={1}>
            <Outlet />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}
