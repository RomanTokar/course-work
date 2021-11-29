import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReportType } from '../models/report'
import { AppThunkAPIConfig } from './index'
import {
  addReportAPI,
  deleteReportAPI,
  getReportsAPI,
  updateReportAPI,
} from '../api/reports'
import { OrganizationType } from '../models/organization'

export interface ReportsState {
  loading: boolean
  reports: ReportType[]
  organizationId: OrganizationType['id']
}

const initialState: ReportsState = {
  loading: false,
  reports: [],
  organizationId: '',
}

export const addReportThunk = createAsyncThunk<
  void,
  Omit<ReportType, 'id' | 'userId'>,
  AppThunkAPIConfig
>(
  'reports/add-report',
  async ({ title, date, duration }, { getState, dispatch }) => {
    try {
      const { user } = getState().auth
      const { organizationId } = getState().reports

      if (!user || !organizationId) return

      const newReport: Omit<ReportType, 'id'> = {
        title,
        date,
        duration,
        userId: user.id,
      }

      const doc = await addReportAPI(user.id, newReport, organizationId)
      dispatch(addReport({ ...newReport, id: doc.id }))
    } catch (error) {
      console.log(error)
    }
  }
)

export const updateReportThunk = createAsyncThunk<
  void,
  Pick<ReportType, 'id'> & Partial<ReportType>,
  AppThunkAPIConfig
>('reports/update-report', async (report, { getState, dispatch }) => {
  try {
    const { user } = getState().auth
    const { organizationId } = getState().reports

    if (!user || !organizationId) return

    await updateReportAPI(user.id, report, organizationId)
    dispatch(updateReport(report))
  } catch (error) {
    console.log(error)
  }
})

export const deleteReportThunk = createAsyncThunk<
  void,
  string,
  AppThunkAPIConfig
>('reports/delete-report', async (reportId, { getState, dispatch }) => {
  try {
    const { user } = getState().auth
    const { organizationId } = getState().reports

    if (!user || !organizationId) return

    await deleteReportAPI(user.id, reportId, organizationId)
    dispatch(deleteReport(reportId))
  } catch (error) {
    console.log(error)
  }
})

export const getReportsThunk = createAsyncThunk<
  void,
  void,
  AppThunkAPIConfig
>('reports/get-reports', async (_, { getState, dispatch }) => {
  dispatch(setLoading(true))

  try {
    const { user } = getState().auth
    const { organizationId } = getState().reports

    if (!user || !organizationId) return

    const reports = await getReportsAPI(user.id, organizationId)
    dispatch(setReports(reports))
  } catch (error) {
    console.log(error)
  } finally {
    dispatch(setLoading(false))
  }
})

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setOrganizationId(
      state,
      { payload }: PayloadAction<OrganizationType['id']>
    ) {
      state.organizationId = payload
    },
    setLoading(state, { payload }: PayloadAction<ReportsState['loading']>) {
      state.loading = payload
    },
    setReports(state, { payload }: PayloadAction<ReportsState['reports']>) {
      state.reports = payload
    },
    deleteReport(state, { payload }: PayloadAction<string>) {
      state.reports = state.reports.filter(r => r.id !== payload)
    },
    addReport(state, { payload }: PayloadAction<ReportType>) {
      state.reports.push(payload)
    },
    updateReport(
      state,
      { payload }: PayloadAction<Partial<ReportType> & Pick<ReportType, 'id'>>
    ) {
      state.reports = state.reports.map(r =>
        r.id === payload.id ? { ...r, ...payload } : r
      )
    },
  },
})

export const {
  setLoading,
  addReport,
  setReports,
  deleteReport,
  updateReport,
  setOrganizationId,
} = reportsSlice.actions

export default reportsSlice.reducer
