import React, { useEffect } from 'react'
import { Box, Button, Grid, Paper, TextField } from '@mui/material'
import { updateOrganizationThunk } from '../store/organizations-slice'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { useAppDispatch, useAppSelector } from '../store'

type OrganizationFormData = {
  title: string
}

const schema = object({
  title: string().required('Required'),
})

const UpdateOrganizationTitleForm = () => {
  const organization = useAppSelector(
    state => state.editOrganization.organization
  )
  const loading = useAppSelector(state => state.editOrganization.loading)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OrganizationFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async ({ title }: OrganizationFormData) => {
    if (errors.title || !organization) return

    await dispatch(
      updateOrganizationThunk({
        title,
        id: organization.id,
      })
    )
  }

  useEffect(() => {
    if (!organization) return

    setValue('title', organization.title)
  }, [organization])

  return (
    <Box component={Paper} mb={2} p={2}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} justifyContent={'center'}>
          <Grid item xs>
            <TextField
              {...register('title')}
              fullWidth
              disabled={loading}
              label={'Назва організації'}
              InputLabelProps={{ shrink: true }}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid>
          <Grid item xs={'auto'}>
            <Button color={'primary'} variant={'contained'} type={'submit'}>
              Зберегти
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default UpdateOrganizationTitleForm
