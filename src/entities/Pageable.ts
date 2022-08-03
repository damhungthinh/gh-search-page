export type Pageable = {
  numberOfElements: number
  totalElements: number
  totalPages: number
  size: number
  page: number
  first: boolean
  last: boolean
}

export type PagingSortingConditions = {
  sortBy: string
  size: number
  page: number
}
