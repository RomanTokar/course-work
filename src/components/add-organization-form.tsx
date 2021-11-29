import React, { memo } from 'react'
import { Box, Button, Grid, Paper, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { addOrganizationThunk } from '../store/organizations-slice'

export type OrganizationFormData = {
  title: string
}

const schema = object({
  title: string().required('Required'),
})

const AddOrganizationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OrganizationFormData>({
    defaultValues: { title: '' },
    resolver: yupResolver(schema),
  })
  const dispatch = useDispatch()

  const onSubmit = ({ title }: OrganizationFormData) => {
    dispatch(addOrganizationThunk(title))
    setValue('title', '')
  }

  return (
    <Box p={2} component={Paper} mb={2} sx={{ position: 'sticky', top: 80 }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid
          container
          spacing={2}
          alignItems={'flex-start'}
          justifyContent={'center'}
        >
          <Grid item xs={12} md>
            <TextField
              {...register('title')}
              fullWidth
              label={'Назва організації'}
              error={!!errors?.title}
              helperText={errors?.title?.message}
            />
          </Grid>
          <Grid item>
            <Button type={'submit'} color={'primary'} variant={'contained'}>
              Додати
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default memo(AddOrganizationForm)
