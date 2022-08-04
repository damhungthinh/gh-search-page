import { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GitHub, Search } from '@mui/icons-material'
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { GhUserSearchBox } from '@components/organisms'
import GhUserList from '@components/organisms/components/GhUserList'
import { GhUser } from '@entity/GhUser'

import { Dispatch, RootState } from '@redux/index'
import { useLocation } from 'react-router'

export const GithubSearch = () => {
  const location = useLocation()
  const dispatch = useDispatch<Dispatch>()
  const isLoading = useSelector((state: RootState) => state.loading.global)
  const { conditions, list, pageable } = useSelector((state: RootState) => state.ghUser)

  const handleSearch = useCallback(
    (value: string) => dispatch.ghUser.fetchList({ ...conditions, keyword: value }),
    [dispatch, conditions]
  )

  const handlePageChanged = useCallback(
    (page: number) => dispatch.ghUser.fetchList({ ...conditions, page }),
    [dispatch, conditions]
  )

  const handleFavourite = useCallback(
    (ghUSer: GhUser) => {
      dispatch.ghUser.favouriteUsers(ghUSer)
      dispatch.snackbar.openSnackbar({
        mesasge: `Favourite ${ghUSer.login} successfull.`,
        type: 'success'
      })
    },
    [dispatch]
  )

  const handleUnFavourite = useCallback(
    (ghUSer: GhUser) => {
      dispatch.ghUser.unFavouriteUsers(ghUSer)
      dispatch.snackbar.openSnackbar({
        mesasge: `Un favourite ${ghUSer.login} successfull.`,
        type: 'success'
      })
    },
    [dispatch]
  )

  useEffect(() => {
    if (conditions.keyword) {
      handleSearch(conditions.keyword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const Icon = conditions.keyword ? Search : GitHub

  return (
    <Box flex={1}>
      <GhUserSearchBox loading={isLoading} keyword={conditions.keyword} onSearch={handleSearch} />
      <Divider variant="fullWidth" style={{ margin: 20 }} />
      {!list.length && (
        <Stack justifyContent="center" gap={1} alignItems="center">
          <Stack justifyContent="center" gap={1} alignItems="center" width="80%" maxWidth="500px">
            {isLoading ? (
              <CircularProgress size="200px" sx={{ color: 'inherit' }} />
            ) : (
              <Icon sx={{ width: '200px', height: '200px' }} />
            )}
            <Stack justifyContent="center" gap={1} alignItems="center">
              {conditions.keyword ? (
                <>
                  <Typography>
                    {isLoading ? 'Please wait, we are searching for' : 'No search result for'}
                  </Typography>
                  <Typography fontWeight="bold">{conditions.keyword}</Typography>
                </>
              ) : (
                <>
                  <Typography fontWeight="bold" variant="h2">
                    GitHub
                  </Typography>
                  <Typography textAlign="center">
                    Enter GitHub username and search users matching the input like Google Search,
                    click avatars to view more details, incuding repositories, followers and
                    following.
                  </Typography>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
      <GhUserList
        keyword={conditions.keyword}
        list={list}
        pageable={pageable}
        onPageChanged={handlePageChanged}
        onFavourite={handleFavourite}
        onUnFavourite={handleUnFavourite}
      />
    </Box>
  )
}
