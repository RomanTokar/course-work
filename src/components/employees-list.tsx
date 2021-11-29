import React from 'react'
import { Box, CircularProgress, List, Typography } from '@mui/material'
import EmployeesItem from './employees-item'
import { useAppSelector } from '../store'

const EmployeesList = () => {
  const employees = useAppSelector(state => state.editOrganization.employees)
  const loading = useAppSelector(state => state.editOrganization.loading)

  return (
    <Box mt={2}>
      {loading ? (
        <CircularProgress sx={{ mx: 'auto', display: 'block' }} />
      ) : employees.length === 0 ? (
        <Typography align={'center'}>There are no employees</Typography>
      ) : (
        <List>
          {employees.map(e => (
            <EmployeesItem employee={e} key={e.id} />
          ))}
        </List>
      )}
    </Box>
  )
}

export default EmployeesList
