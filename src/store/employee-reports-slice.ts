import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReportType } from '../models/report'
import { AppThunkAPIConfig } from './index'
import { getReportsAPI } from '../api/reports'
import { UserType } from '../models/user'
import { OrganizationType } from '../models/organization'

export interface EmployeeReportsState {
  loading: boolean
  reports: ReportType[]
  organizationId: OrganizationType['id']
}

const initialState: EmployeeReportsState = {
  loading: false,
  reports: [],
  organizationId: '',
}

export const getEmployeeReportsThunk = createAsyncThunk<
  void,
  UserType['id'],
  AppThunkAPIConfig
>('employee-reports/get-reports', async (userId, { dispatch, getState }) => {
  dispatch(setLoading(true))
  const { organizationId } = getState().employeeReports

  try {
    const reports = await getReportsAPI(userId, organizationId)
    dispatch(setReports(reports))
  } catch (error) {
    console.log(error)
  } finally {
    dispatch(setLoading(false))
  }
})

export const employeeReportsSlice = createSlice({
  name: 'employee-reports',
  initialState,
  reducers: {
    setOrganizationId(
      state,
      { payload }: PayloadAction<OrganizationType['id']>
    ) {
      state.organizationId = payload
    },
    setLoading(
      state,
      { payload }: PayloadAction<EmployeeReportsState['loading']>
    ) {
      state.loading = payload
    },
    setReports(
      state,
      { payload }: PayloadAction<EmployeeReportsState['reports']>
    ) {
      state.reports = payload
    },
  },
})

export const { setLoading, setReports, setOrganizationId } =
  employeeReportsSlice.actions

export default employeeReportsSlice.reducer
