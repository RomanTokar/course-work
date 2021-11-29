import { UserType } from './user'
import { ReportType } from './report'

export type EmployeeType = UserType & {
  role: 'employee'
  reports: ReportType[]
}
