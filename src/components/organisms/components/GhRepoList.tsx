import { GhRepo } from '@entity/GhUser'
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
  Stack
} from '@mui/material'

type GhRepoListProps = {
  loading: boolean
  list: Array<GhRepo>
}

const GhRepoList = (props: GhRepoListProps) => {
  const { loading, list = [] } = props

  return (
    <Grid container spacing={{ xs: 2 }} flexDirection="column" wrap="wrap" alignItems="end">
      <Box position="relative" zIndex={(theme) => theme.zIndex.drawer + 1}>
        <Backdrop open={loading}>
          <CircularProgress />
        </Backdrop>
        <Grid container spacing={{ xs: 2 }} wrap="wrap">
          {list.map((it) => (
            <Grid key={it.id} item xs={12} sm={6} lg={4} xl={3}>
              <Card sx={{ display: 'flex', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography
                      component="span"
                      fontWeight="bold"
                      variant="h5"
                      style={{ overflowWrap: 'anywhere' }}>
                      {it.name}
                    </Typography>
                    <Stack>
                      <Typography>{it.stars} stars</Typography>
                      <Typography>{it.forks} forks</Typography>
                    </Stack>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Grid>
  )
}

export default GhRepoList
