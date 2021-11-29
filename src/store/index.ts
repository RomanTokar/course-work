import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice'
import reportsReducer from './reports-slice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import organizationsReducer from './organizations-slice'
import editOrganizationReducer from './edit-organization-slice'
import employeeReportsReducer from './employee-reports-slice'
import employeeOrganizationsReducer from './employee-organizations-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
    organizations: organizationsReducer,
    editOrganization: editOrganizationReducer,
    employeeReports: employeeReportsReducer,
    employeeOrganizations: employeeOrganizationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunkAPIConfig = { state: RootState; dispatch: AppDispatch }
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
