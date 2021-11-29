import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '../../../store'
import { Box, Paper } from '@mui/material'
import { getOrganizationThunk } from '../../../store/edit-organization-slice'
import EmployeesList from '../../../components/employees-list'
import UpdateOrganizationTitleForm from '../../../components/update-organization-title-form'
import AddEmployeeForm from '../../../components/add-employee-form'

const EditOrganizationPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getOrganizationThunk(id))
  }, [])

  return (
    <Box m={2}>
      <UpdateOrganizationTitleForm />
      <Box p={2} component={Paper}>
        <AddEmployeeForm />
        <EmployeesList />
      </Box>
    </Box>
  )
}

export default EditOrganizationPage
