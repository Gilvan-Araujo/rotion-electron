import Store from 'electron-store'
import { Document } from '@shared/types/ipc'
import { is } from '@electron-toolkit/utils'

interface StoreSchema {
  documents: Record<string, Document>
}

export const store = new Store<StoreSchema>({
  name: is.dev ? 'dev-store' : 'store',
  defaults: {
    documents: {},
  },
})

console.log(store.path)
