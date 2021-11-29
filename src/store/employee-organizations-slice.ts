import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunkAPIConfig } from './index'
import { OrganizationType } from '../models/organization'
import { deleteOrganizationAPI } from '../api/organizations'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from 'firebase/firestore/lite'
import { firestore } from '../firebase'

export interface OrganizationsState {
  loading: boolean
  organizations: OrganizationType[]
}

const initialState: OrganizationsState = {
  loading: false,
  organizations: [],
}

export const deleteOrganizationThunk = createAsyncThunk<
  void,
  OrganizationType['id'],
  AppThunkAPIConfig
>(
  'employee-organizations/delete-organization',
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
  'employee-organizations/get-organizations',
  async (thunkArgs, { getState, dispatch }) => {
    dispatch(setLoading(true))

    try {
      const { user } = getState().auth

      if (!user) return

      const employeeOrganizationsRef = collection(
        firestore,
        `users/${user.id}/organizations`
      )
      const q = query(employeeOrganizationsRef)
      const querySnapshot = await getDocs(q)
      const employeeOrganizations = querySnapshot.docs.map(doc => {
        const organization = doc.data()

        return {
          ...organization,
        }
      })

      const organizations = await Promise.all(
        employeeOrganizations.map(async ({ organizationId, employerId }) => {
          const employerOrganizationRef = doc(
            firestore,
            `users/${employerId}/organizations/${organizationId}`
          )
          const organizationsDoc = await getDoc(employerOrganizationRef)

          return {
            ...organizationsDoc.data(),
            id: organizationsDoc.id,
          } as OrganizationType
        })
      )
      dispatch(setOrganizations(organizations))
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const employeeOrganizationsSlice = createSlice({
  name: 'employee-organizations',
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
    deleteOrganization(
      state,
      { payload }: PayloadAction<OrganizationType['id']>
    ) {
      state.organizations = state.organizations.filter(o => o.id !== payload)
    },
  },
})

export const { setLoading, setOrganizations, deleteOrganization } =
  employeeOrganizationsSlice.actions

export default employeeOrganizationsSlice.reducer
