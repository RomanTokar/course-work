import React, { FC } from 'react'
import { EmployeeType } from '../models/employee'
import { Grid, IconButton, ListItem, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useAppDispatch, useAppSelector } from '../store'
import { deleteEmployeeThunk } from '../store/edit-organization-slice'
import { Link } from 'react-router-dom'

type EmployeesItemProps = {
  employee: EmployeeType
}

const EmployeesItem: FC<EmployeesItemProps> = ({ employee }) => {
  const organizationId = useAppSelector(
    state => state.editOrganization.organization?.id
  )
  const dispatch = useAppDispatch()

  const deleteEmployee = () => {
    dispatch(deleteEmployeeThunk(employee.id))
  }

  return (
    <ListItem>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs>
          <Typography>{`${employee.firstName} ${employee.lastName}`}</Typography>
        </Grid>
        <Grid item>
          <IconButton
            color={'primary'}
            aria-label="review"
            component={Link}
            to={`/organizations/${organizationId}/employee/${employee.id}/reports`}
          >
            <VisibilityIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            color={'error'}
            aria-label="delete"
            onClick={deleteEmployee}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  )
}

export default EmployeesItem
