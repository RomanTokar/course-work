import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OrganizationType } from '../models/organization'
import { AppThunkAPIConfig } from './index'
import { getOrganizationAPI } from '../api/organizations'
import {
  addEmployeeAPI,
  deleteEmployeeAPI,
  getEmployeesAPI,
} from '../api/employees'
import { EmployeeType } from '../models/employee'
import { omit } from 'lodash-es'

export interface OrganizationState {
  loading: boolean
  organization: OrganizationType | null
  employees: EmployeeType[]
}

const initialState: OrganizationState = {
  loading: false,
  organization: null,
  employees: [],
}

export const getOrganizationThunk = createAsyncThunk<
  void,
  OrganizationType['id'],
  AppThunkAPIConfig
>(
  'edit-organization/get-organization',
  async (organizationId, { getState, dispatch }) => {
    try {
      dispatch(setLoading(true))

      const { user } = getState().auth

      if (!user) return

      const organization = await getOrganizationAPI(user.id, organizationId)
      const employees = await getEmployeesAPI(
        user.id,
        organizationId,
        organization.employeeIds
      )
      dispatch(setOrganization(omit(organization, 'employees')))
      dispatch(setEmployees(employees))
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const deleteEmployeeThunk = createAsyncThunk<
  void,
  EmployeeType['id'],
  AppThunkAPIConfig
>(
  'edit-organization/delete-employee',
  async (employeeId, { getState, dispatch }) => {
    try {
      const { user } = getState().auth
      const { organization } = getState().editOrganization

      if (!user || !organization) return

      await deleteEmployeeAPI(user.id, organization.id, employeeId)
      dispatch(deleteEmployee(employeeId))
    } catch (error) {
      console.log(error)
    }
  }
)

export const addEmployeeThunk = createAsyncThunk<
  void,
  EmployeeType['email'],
  AppThunkAPIConfig
>(
  'edit-organization/add-employee',
  async (employeeEmail, { getState, dispatch }) => {
    try {
      const { user } = getState().auth
      const { organization } = getState().editOrganization

      if (!user || !organization) return

      const employee = await addEmployeeAPI(
        user.id,
        organization.id,
        employeeEmail
      )
      dispatch(addEmployee(employee))
    } catch (error) {
      console.log(error)
    }
  }
)

export const editOrganizationSlice = createSlice({
  name: 'edit-organization',
  initialState,
  reducers: {
    setLoading(
      state,
      { payload }: PayloadAction<OrganizationState['loading']>
    ) {
      state.loading = payload
    },
    setOrganization(
      state,
      { payload }: PayloadAction<OrganizationState['organization']>
    ) {
      state.organization = payload
    },
    setEmployees(
      state,
      { payload }: PayloadAction<OrganizationState['employees']>
    ) {
      state.employees = payload
    },
    addEmployee(state, { payload }: PayloadAction<EmployeeType>) {
      state.employees.push(payload)
    },
    deleteEmployee(state, { payload }: PayloadAction<EmployeeType['id']>) {
      state.employees = state.employees.filter(e => e.id !== payload)
    },
  },
})

export const {
  setLoading,
  setOrganization,
  setEmployees,
  deleteEmployee,
  addEmployee,
} = editOrganizationSlice.actions

export default editOrganizationSlice.reducer
