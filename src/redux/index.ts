import { init, Models, RematchDispatch, RematchRootState } from '@rematch/core'
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading'
import immerPlugin from '@rematch/immer'
import { ghUserSearch } from './search'
import { snackbar } from './snackbar'

export interface RootModel extends Models<RootModel> {
  ghUser: typeof ghUserSearch
  snackbar: typeof snackbar
}

const models: RootModel = {
  ghUser: ghUserSearch,
  snackbar
}

type FullModel = ExtraModelsFromLoading<RootModel>

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin({ type: 'boolean' }), immerPlugin()]
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
