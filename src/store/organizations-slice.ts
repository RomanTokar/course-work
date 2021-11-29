import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunkAPIConfig } from './index'
import { OrganizationType } from '../models/organization'
import {
  addOrganizationAPI,
  deleteOrganizationAPI,
  getOrganizationsAPI,
  updateOrganizationAPI,
} from '../api/organizations'

export interface OrganizationsState {
  loading: boolean
  organizations: OrganizationType[]
}

const initialState: OrganizationsState = {
  loading: false,
  organizations: [],
}

export const addOrganizationThunk = createAsyncThunk<
  void,
  OrganizationType['title'],
  AppThunkAPIConfig
>('organizations/add-organization', async (title, { getState, dispatch }) => {
  try {
    const { user } = getState().auth

    if (!user) return

    const newOrganization: Omit<OrganizationType, 'id'> & {
      employeeIds: string[]
    } = {
      title,
      employerId: user.id,
      employeeIds: [],
    }

    const doc = await addOrganizationAPI(user.id, newOrganization)

    dispatch(addOrganization({ ...newOrganization, id: doc.id }))
  } catch (error) {
    console.log(error)
  }
})

export const updateOrganizationThunk = createAsyncThunk<
  void,
  Partial<OrganizationType> & Pick<OrganizationType, 'id'>,
  AppThunkAPIConfig
>(
  'organizations/update-organization',
  async (organization, { getState, dispatch }) => {
    try {
      const { user } = getState().auth

      if (!user) return

      await updateOrganizationAPI(user.id, organization)
      dispatch(updateOrganization(organization))
    } catch (error) {
      console.log(error)
    }
  }
)

export const deleteOrganizationThunk = createAsyncThunk<
  void,
  OrganizationType['id'],
  AppThunkAPIConfig
>(
  'organizations/delete-organization',
  async (organizationId, { getState, dispatch }) => {
    try {
      const { user } = getState().auth

      if (!user) return

      await deleteOrganizationAPI(user.id, organizationId)
      dispatch(deleteOrganization(organizationId))
    } catch (error) {
      console.log(error)
    }
  }
)

export const getOrganizationsThunk = createAsyncThunk<
  void,
  void,
  AppThunkAPIConfig
>(
  'organizations/get-organizations',
  async (thunkArgs, { getState, dispatch }) => {
    dispatch(setLoading(true))

    try {
      const { user } = getState().auth

      if (!user) return

      const organizations = await getOrganizationsAPI(user.id)

      dispatch(setOrganizations(organizations))
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setLoading(
      state,
      { payload }: PayloadAction<OrganizationsState['loading']>
    ) {
      state.loading = payload
    },
    setOrganizations(
      state,
      { payload }: PayloadAction<OrganizationsState['organizations']>
    ) {
      state.organizations = payload
    },
    addOrganization(state, { payload }: PayloadAction<OrganizationType>) {
      state.organizations.push(payload)
    },
    deleteOrganization(
      state,
      { payload }: PayloadAction<OrganizationType['id']>
    ) {
      state.organizations = state.organizations.filter(o => o.id !== payload)
    },
    updateOrganization(
      state,
      {
        payload,
      }: PayloadAction<Partial<OrganizationType> & Pick<OrganizationType, 'id'>>
    ) {
      state.organizations = state.organizations.map(o =>
        o.id === payload.id ? { ...o, ...payload } : o
      )
    },
  },
})

export const {
  setLoading,
  setOrganizations,
  addOrganization,
  deleteOrganization,
  updateOrganization,
} = organizationsSlice.actions

export default organizationsSlice.reducer
