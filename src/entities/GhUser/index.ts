import { Pageable } from '@entity/Pageable'
import { CustomError } from '@utils/apiErrorHandler'

export interface GhUser {
  id: number
  login: string
  fullname: string
  company: string
  location: string
  avatarUrl: string
  followerCount: number
  followingCount: number
  followers: Array<GhUser>
  following: Array<GhUser>
  repositories: Array<GhRepo>
  favourited: boolean
}

export interface GhRepo {
  id: number
  name: string
  stars: number
  forks: number
}

export interface GhUserSearchConditions {
  keyword?: string
  sortBy: {
    field: string
    direction: 'asc' | 'desc'
  }
  size: number
  page: number
}

export interface GithubSearchState {
  list: Array<GhUser>
  favourites: Array<GhUser>
  item?: GhUser
  conditions: GhUserSearchConditions
  pageable: Pageable
  error?: CustomError
}
