import { GhUser, GhUserSearchConditions, GithubSearchState } from '@entity/GhUser'
import { Pageable } from '@entity/Pageable'
import { createModel } from '@rematch/core'
import { apiErrorHandler } from '@utils/apiErrorHandler'
import { fetch } from '@utils/axiosFetch'
import { GH_SEARCH_KEYWORD, GH_SEARCH_FAVOURITE } from '@enums/AppConst'
import { RootModel } from '..'

export const ghUserSearch = createModel<RootModel>()({
  state: {
    list: [],
    favourites: [],
    conditions: {
      keyword: localStorage.getItem(GH_SEARCH_KEYWORD) || '',
      sortBy: {
        field: 'bestmatch',
        direction: 'desc'
      },
      page: 0,
      size: 10
    },
    pageable: {
      numberOfElements: 0,
      totalElements: 0,
      totalPages: 0,
      size: 20,
      page: 0,
      first: true,
      last: true
    }
  } as GithubSearchState,
  reducers: {
    fetchListSucceed(state, payload) {
      state.list = payload.list
      state.pageable = payload.pageable
      state.conditions = payload.conditions

      localStorage.setItem(GH_SEARCH_KEYWORD, payload.conditions.keyword)
    },
    fetchUserSucceed(state, payload) {
      state.item = payload
    },
    fetchFollowerSucceed(state, payload) {
      if (state.item) {
        state.item.followers = payload
      }
    },
    fetchFollowingSucceed(state, payload) {
      if (state.item) {
        state.item.following = payload
      }
    },
    favouriteUsers(state, payload: GhUser) {
      const favUser = { ...payload, favourited: true }
      const favourites = [...state.favourites, favUser]
      state.favourites.push(favUser)

      const index = state.list.findIndex((it) => it.id === payload.id)
      state.list[index].favourited = true

      localStorage.setItem(GH_SEARCH_FAVOURITE, JSON.stringify(favourites))
    },
    unFavouriteUsers(state, payload) {
      const favourites = [...state.favourites].filter((it) => it.id !== payload.id)
      state.favourites = favourites
      const index = state.list.findIndex((it) => it.id === payload.id)
      state.list[index].favourited = true
      localStorage.setItem(GH_SEARCH_FAVOURITE, JSON.stringify(favourites))
    },
    initFavouriteUsers(state) {
      const storged = localStorage.getItem(GH_SEARCH_FAVOURITE) || ''
      let favourites: Array<GhUser> = []
      if (storged) {
        favourites = JSON.parse(storged) as Array<GhUser>
      }
      state.favourites = favourites
    },
    handleFailed(state, { data, status }) {
      const apiError = apiErrorHandler({ status, ...data })
      state.error = { ...apiError }
    },
    cleanError(state) {
      state.error = undefined
    }
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async fetchList(conditions: GhUserSearchConditions) {
      const { keyword, page, sortBy, size } = conditions
      const { field = 'bestmatch', direction = 'desc' } = sortBy
      await fetch({
        url: '/search/users',
        method: 'GET',
        params: {
          q: `${keyword} in:login`,
          per_page: size,
          page,
          sort: field,
          direction,
          type: 'Users'
        }
      })
        .then(async ({ data }) => {
          const { items, total_count, incomplete_results } = data
          const totalPages = Math.ceil(total_count / size)
          const pageable: Pageable = {
            numberOfElements: total_count > (page + 1) * size ? total_count - page * size : size,
            totalElements: total_count,
            last: !incomplete_results,
            first: page === 1,
            totalPages,
            page,
            size
          }

          const list: Array<GhUser> = []
          const favourites = localStorage.getItem(GH_SEARCH_FAVOURITE) || ''
          let favouritedIds: Array<number> = []
          if (favourites) {
            favouritedIds = (JSON.parse(favourites) as Array<GhUser>).map((it) => it.id)
          }
          let ghUser: GhUser
          for (let item of items) {
            ghUser = {
              id: item.id,
              avatarUrl: item.avatar_url,
              followerCount: 0,
              followingCount: 0,
              login: item.login,
              company: '',
              fullname: '',
              location: '',
              repositories: [],
              followers: [],
              following: [],
              favourited: favouritedIds.includes(item.id)
            }

            let data = await fetch({
              url: item.url,
              method: 'GET'
            })
              .then(({ data }) => data)
              .catch((err) => {
                dispatch.ghUser.handleFailed({
                  status: 500,
                  reason: 'Github API call reach limited. Please try again laters'
                })
                dispatch.snackbar.openSnackbar({
                  message: 'Github API call reach limited. Please try again laters',
                  type: 'err'
                })
              })
            ghUser.company = data.company
            ghUser.fullname = data.name
            ghUser.location = data.location
            ghUser.followerCount = data.followers
            ghUser.followingCount = data.following
            list.push(ghUser)
          }
          dispatch.ghUser.fetchListSucceed({ list, pageable, conditions })
        })
        .catch((reason) => {
          dispatch.ghUser.handleFailed(reason)
        })
    },
    async fetchUser(username: string) {
      await fetch({
        url: `/users/${username}`,
        method: 'GET'
      })
        .then(async ({ data }) => {
          const favourites = localStorage.getItem(GH_SEARCH_FAVOURITE) || ''
          let favouritedIds: Array<number> = []
          if (favourites) {
            favouritedIds = (JSON.parse(favourites) as Array<GhUser>).map((it) => it.id)
          }
          const user: GhUser = {
            id: data.id,
            avatarUrl: data.avatar_url,
            login: data.login,
            company: data.company,
            fullname: data.name,
            location: data.location,
            repositories: [],
            followers: [],
            following: [],
            followerCount: data.followers_count,
            followingCount: data.following_count,
            favourited: favouritedIds.includes(data.id)
          }
          user.repositories = await fetch({
            url: data.repos_url,
            method: 'GET'
          }).then(({ data: repos }) =>
            repos.map((it: any) => ({
              id: it.id,
              name: it.name,
              forks: it.forks_count,
              stars: it.stargazers_count
            }))
          )
          dispatch.ghUser.fetchUserSucceed(user)
        })
        .catch((reason) => {
          dispatch.ghUser.handleFailed(reason)
          dispatch.snackbar.openSnackbar({
            message: 'Github API call reach limited. Please try again laters',
            type: 'err'
          })
        })
    },
    async fetchFollowers(username: string) {
      await fetch({
        url: `/users/${username}/followers`,
        method: 'GET'
      })
        .then(async ({ data }) => {
          dispatch.ghUser.fetchFollowerSucceed(data)
          dispatch.snackbar.openSnackbar({
            message: 'Following fetching successfull.',
            type: 'succeed'
          })
        })
        .catch((reason) => {
          dispatch.ghUser.handleFailed(reason)
          dispatch.snackbar.openSnackbar({
            message: 'Github API call reach limited. Please try again laters',
            type: 'err'
          })
        })
    },
    async fetchFollowing(username: string) {
      await fetch({
        url: `/users/${username}/following`,
        method: 'GET'
      })
        .then(async ({ data }) => {
          dispatch.ghUser.fetchFollowingSucceed(data)
          dispatch.snackbar.openSnackbar({
            message: 'Followers fetching successfull.',
            type: 'succeed'
          })
        })
        .catch((reason) => {
          dispatch.ghUser.handleFailed(reason)
          dispatch.snackbar.openSnackbar({
            message: 'Github API call reach limited. Please try again laters',
            type: 'err'
          })
        })
    }
  })
})
