import { SyntheticEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Apartment } from '@mui/icons-material'
import { Avatar, Stack, Tab, Tabs, Typography, Box, Skeleton } from '@mui/material'

import GhRepoList from '@components/organisms/components/GhRepoList'
import GhUserList from '@components/organisms/components/GhUserList'
import { Dispatch, RootState } from '@redux/index'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

export const GithubUser = () => {
  const dispatch = useDispatch<Dispatch>()
  const { username } = useParams()
  const loading = useSelector((state: RootState) => state.loading.global)
  const item = useSelector((state: RootState) => state.ghUser.item)
  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        break
      case 1:
        dispatch.ghUser.fetchFollowers(username!!)
        break
      case 2:
        dispatch.ghUser.fetchFollowing(username!!)
        break
    }
    setValue(newValue)
  }

  useEffect(() => {
    dispatch.ghUser.fetchUser(username || '')
    setValue(0)
  }, [dispatch, username])

  return (
    <Stack gap={2} justifyContent="center" alignItems="center">
      <Stack justifyContent="center" gap={1} alignItems="center">
        {loading ? (
          <>
            <Skeleton variant="circular" width="25vw" height="25vw" />
            <Skeleton variant="text" width="50vw" />
            <Skeleton variant="text" width="50vw" />
            <Skeleton variant="text" width="50vw" />
          </>
        ) : (
          <>
            <Avatar src={item?.avatarUrl} sx={{ width: '25vw', height: '25vw' }} />
            <Typography variant="h4">{item?.fullname}</Typography>
            <Typography>{item?.login}</Typography>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Apartment />
              {item?.company}
            </Stack>
          </>
        )}
      </Stack>

      <Tabs centered value={value} onChange={handleChange} aria-label="icon position tabs example">
        <Tab label="repositories" />
        <Tab label="followers" />
        <Tab label="following" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <GhRepoList list={item?.repositories || []} loading={loading} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GhUserList list={item?.followers || []} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GhUserList list={item?.following || []} />
      </TabPanel>
    </Stack>
  )
}
