import { OrganizationType } from './organization'
import { UserType } from './user'

export type EmployerType = UserType & {
  role: 'employer'
  workspaces: OrganizationType[]
}
