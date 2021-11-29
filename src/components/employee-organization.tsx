import React, { FC } from 'react'
import { OrganizationType } from '../models/organization'
import { Grid, IconButton, ListItem, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch } from '../store'
import { deleteOrganizationThunk } from '../store/employee-organizations-slice'
import { Link } from 'react-router-dom'

type OrganizationProps = {
  divider: boolean
  organization: OrganizationType
}

const Organization: FC<OrganizationProps> = ({ divider, organization }) => {
  const dispatch = useAppDispatch()

  const deleteOrganization = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    dispatch(deleteOrganizationThunk(organization.id))
  }

  return (
    <ListItem
      divider={divider}
      button
      component={Link}
      to={`/organizations/${organization.id}/reports`}
    >
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs>
          <Typography>{organization.title}</Typography>
        </Grid>
        <Grid item>
          <IconButton
            color={'error'}
            aria-label="delete"
            onClick={deleteOrganization}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  )
}

export default Organization
