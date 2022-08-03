import { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, Stack, Typography } from '@mui/material'
import { People } from '@mui/icons-material'

import { Dispatch, RootState } from '@redux/index'

import GhUserList from '@components/organisms/components/GhUserList'
import { GhUser } from '@entity/GhUser'

export const GithubFavouriteUser = () => {
  const dispatch = useDispatch<Dispatch>()
  const { favourites } = useSelector((state: RootState) => state.ghUser)

  const handleUnFavourite = useCallback(
    (ghUSer: GhUser) => {
      dispatch.ghUser.unFavouriteUsers(ghUSer)
    },
    [dispatch]
  )

  useEffect(() => {
    if (!favourites.length) {
      dispatch.ghUser.initFavouriteUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])
  return (
    <Stack gap={1} height="100%">
      <Typography variant="h3">Fourites</Typography>
      <Divider variant="fullWidth" style={{ margin: 20 }} />
      {!favourites.length && (
        <Stack flex={1} justifyContent="center" alignItems="center">
          <Stack justifyContent="center" gap={1} alignItems="center" width="80%" maxWidth="500px">
            <People sx={{ width: 50, height: 50 }} />
            <Typography textAlign="center">One you like pepople, you'll see them here.</Typography>
          </Stack>
        </Stack>
      )}
      <GhUserList list={favourites} onUnFavourite={handleUnFavourite} />
    </Stack>
  )
}
