import { memo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ThemeModeProvider } from '@components/providers/ThemeModeProvider'
import { MainLayout } from '@components/templates/MainLayout'
import { GithubSearch } from '@components/pages/GithubSearch'
import { GithubUser } from '@components/pages/GithubUser'
import { GithubFavouriteUser } from '@components/pages/GithubFavouriteUsers'

const ApplicationRouters = () => (
  <BrowserRouter>
    <ThemeModeProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<GithubSearch />} />
          <Route path=":username" element={<GithubUser />} />
          <Route path="/liked" element={<GithubFavouriteUser />} />
        </Route>
      </Routes>
    </ThemeModeProvider>
  </BrowserRouter>
)

export default memo(ApplicationRouters, () => true)
