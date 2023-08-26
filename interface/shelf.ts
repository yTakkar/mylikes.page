import { IListInfo } from './list'

export interface IShelfInfo {
  id: string
  name: string
  description: string
  createdAt: number
  listIds: string[]
}

export interface IShelfDetail extends IShelfInfo {
  listInfos: IListInfo[]
}

export interface IGetShelfByIdParams {
  limit?: number
}
