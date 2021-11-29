import React from 'react'
import { Box, Button, Grid, TextField } from '@mui/material'
import { useAppDispatch } from '../store'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { addEmployeeThunk } from '../store/edit-organization-slice'

type AddEmployeeFormData = {
  email: string
}

const schema = object({
  email: string().email('Некоректна електронна пошта').required(`Обов'язково`),
})

const AddEmployeeForm = () => {
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddEmployeeFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async ({ email }: AddEmployeeFormData) => {
    dispatch(addEmployeeThunk(email))
  }

  return (
    <Box component={'form'} onSubmit={handleSubmit(onSubmit)} mb={2} noValidate>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid item xs>
          <TextField
            {...register('email')}
            fullWidth
            label={'Електронна пошта'}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid item xs={'auto'}>
          <Button color={'primary'} variant={'contained'} type={'submit'}>
            Додати
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddEmployeeForm
