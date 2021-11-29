import React, { useEffect } from 'react'
import { useAppSelector } from '../../../store'
import { Box, CircularProgress, List, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { getOrganizationsThunk } from '../../../store/organizations-slice'
import AddOrganizationForm from '../../../components/add-organization-form'
import Organization from '../../../components/organization'

const OrganizationsPage = () => {
  const loading = useAppSelector(state => state.reports.loading)
  const organizations = useAppSelector(
    state => state.organizations.organizations
  )
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getOrganizationsThunk())
  }, [])

  return (
    <Box m={2}>
      <AddOrganizationForm />
      {loading ? (
        <CircularProgress sx={{ mx: 'auto', display: 'block' }} />
      ) : organizations.length === 0 ? (
        <Typography align={'center'}>There are no organizations</Typography>
      ) : (
        <List>
          {organizations.map((o, i) => (
            <Organization
              organization={o}
              key={o.id}
              divider={i + 1 < organizations.length}
            />
          ))}
        </List>
      )}
    </Box>
  )
}

export default OrganizationsPage
