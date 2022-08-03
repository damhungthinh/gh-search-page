import { GhUser } from '@entity/GhUser'
import { Pageable } from '@entity/Pageable'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Typography,
  Pagination,
  Badge
} from '@mui/material'
import siFormatter from '@utils/siNumberFormatter'
import { ChangeEvent, useCallback } from 'react'
import { useNavigate } from 'react-router'

type GhUserListProps = {
  list: Array<GhUser>
  keyword?: string
  pageable?: Pageable
  onPageChanged?: (page: number) => void
  onFavourite?: (user: GhUser) => void
  onUnFavourite?: (user: GhUser) => void
}

const GhUserList = (props: GhUserListProps) => {
  const { list = [], pageable, keyword, onPageChanged, onUnFavourite, onFavourite } = props
  const navigate = useNavigate()
  const handlePageChanged = useCallback(
    (_: ChangeEvent<unknown>, page: number) => onPageChanged && onPageChanged(page),
    [onPageChanged]
  )

  return (
    <Grid container spacing={{ xs: 2 }} flexDirection="column" wrap="wrap" alignItems="end">
      {pageable && pageable.totalPages > 1 && (
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography>
              {pageable.totalElements.toLocaleString('en-US')} GitHub users found
            </Typography>
          </Grid>
          <Grid item>
            <Pagination
              count={pageable.totalPages}
              page={pageable.page}
              onChange={handlePageChanged}
              boundaryCount={2}
              style={{ margin: '20px 0px ' }}
            />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={{ xs: 2 }} wrap="wrap">
        {list.map((it) => (
          <Grid key={it.id} item xs={12} sm={6} lg={4} xl={3}>
            <Card sx={{ display: 'flex', height: '100%' }}>
              <CardMedia
                component="img"
                sx={{ width: 151, cursor: 'pointer' }}
                image={it.avatarUrl}
                defaultValue="https://joeschmoe.io/api/v1/random"
                alt="avatar"
                onClick={() => navigate(`/${it.login}`)}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }} width="100%">
                <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                  <Badge
                    badgeContent={
                      it.favourited ? (
                        <Favorite
                          sx={{ color: 'red', cursor: 'pointer' }}
                          onClick={() => onUnFavourite && onUnFavourite(it)}
                        />
                      ) : (
                        <FavoriteBorder
                          sx={{ color: 'red', cursor: 'pointer' }}
                          onClick={() => onFavourite && onFavourite(it)}
                        />
                      )
                    }
                    style={{ width: '100%' }}>
                    <Typography component="div" variant="h5" style={{ overflowWrap: 'anywhere' }}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: keyword
                            ? it.login.replace(new RegExp(keyword, 'ig'), `<b>${keyword}</b>`)
                            : it.login
                        }}
                      />
                    </Typography>
                  </Badge>
                  {!!it.followerCount && (
                    <Typography>{siFormatter(it.followerCount)} followers</Typography>
                  )}
                  {!!it.followingCount && (
                    <Typography>{siFormatter(it.followingCount)} followings</Typography>
                  )}
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

export default GhUserList
