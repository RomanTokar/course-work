import React from 'react'
import { Box, Button, Container, Grid, TextField } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../store'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { updateUserThunk } from '../../../store/auth-slice'

type SettingsFormData = {
  firstName: string
  lastName: string
}

const schema = object({
  firstName: string().required(`Обов'язково`),
  lastName: string().required(`Обов'язково`),
})

const SettingsPage = () => {
  const firstName = useAppSelector(state => state.auth.user?.firstName)
  const lastName = useAppSelector(state => state.auth.user?.lastName)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: yupResolver(schema),
    defaultValues: { firstName, lastName },
  })

  const onSubmit = async (values: SettingsFormData) => {
    dispatch(updateUserThunk(values))
  }
  return (
    <Container maxWidth={'sm'}>
      <Box p={2}>
        <Grid
          container
          spacing={2}
          component={'form'}
          justifyContent={'center'}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid item xs={12}>
            <TextField
              {...register('firstName')}
              fullWidth
              label={`Ім'я*`}
              error={!!errors?.firstName}
              helperText={errors?.firstName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('lastName')}
              fullWidth
              label={'Прізвище*'}
              error={!!errors?.lastName}
              helperText={errors?.lastName?.message}
            />
          </Grid>
          <Grid item>
            <Button color={'primary'} variant={'contained'} type={'submit'}>
              Оновити
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default SettingsPage
