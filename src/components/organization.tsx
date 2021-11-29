import React, { FC, useEffect, useRef, useState } from 'react'
import { OrganizationType } from '../models/organization'
import {
  Grid,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../store'
import {
  deleteOrganizationThunk,
  updateOrganizationThunk,
} from '../store/organizations-slice'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import mergeRefs from 'react-merge-refs'

type OrganizationProps = {
  divider: boolean
  organization: OrganizationType
}

type OrganizationFormData = {
  title: string
}

const schema = object({
  title: string().required('Required'),
})

const Organization: FC<OrganizationProps> = ({ divider, organization }) => {
  const dispatch = useAppDispatch()
  const [editMode, setEditMode] = useState(false)
  const {
    control,
    formState: { errors },
    getValues,
  } = useForm<OrganizationFormData>({
    mode: 'all',
    defaultValues: { title: organization.title },
    resolver: yupResolver(schema),
    criteriaMode: 'all',
  })
  const inputRef = useRef<HTMLInputElement>(null)

  const deleteOrganization = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    dispatch(deleteOrganizationThunk(organization.id))
  }

  const onTitleTextFieldBlur = async () => {
    if (errors.title) return

    await dispatch(
      updateOrganizationThunk({
        title: getValues('title'),
        id: organization.id,
      })
    )
    setEditMode(false)
  }

  useEffect(() => {
    if (!editMode) return

    inputRef.current?.focus()
  }, [editMode])

  return (
    <ListItem divider={divider}>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs>
          {editMode ? (
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <TextField
                  {...field}
                  size={'small'}
                  label={'Назва організації'}
                  inputRef={mergeRefs([field.ref, inputRef])}
                  fullWidth
                  onBlur={onTitleTextFieldBlur}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
          ) : (
            <Typography onClick={() => setEditMode(true)}>
              {organization.title}
            </Typography>
          )}
        </Grid>
        <Grid item>
          <IconButton
            component={Link}
            to={`/organizations/${organization.id}/edit`}
            color={'primary'}
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
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
