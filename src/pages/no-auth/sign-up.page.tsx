import React from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import InputPassword from '../../components/input-password'
import { Link as RouterLink } from 'react-router-dom'
import { SignUpData } from '../../models/auth'
import { signUp } from '../../store/auth-slice'

const schema = object({
  firstName: string().required(`Обов'язково`),
  lastName: string().required(`Обов'язково`),
  email: string().email('Некоректна електронна пошта').required(`Обов'язково`),
  password: string().required(`Обов'язково`),
})

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignUpData>({
    defaultValues: {
      email: '',
      password: '',
      role: 'employee',
    },
    resolver: yupResolver(schema),
  })
  const dispatch = useDispatch()

  const onSubmit = (values: SignUpData) => {
    dispatch(signUp(values))
  }

  return (
    <Container
      maxWidth={'xs'}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} justifyContent={'center'}>
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
          <Grid item xs={12}>
            <TextField
              type={'email'}
              {...register('email')}
              fullWidth
              label={'Електронна пошта*'}
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <InputPassword
              fullWidth
              label={'Пароль*'}
              error={!!errors?.password}
              helperText={errors?.password?.message}
              {...register('password')}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Controller
              control={control}
              name={'role'}
              render={({ field }) => (
                <ToggleButtonGroup
                  color="primary"
                  exclusive
                  value={field.value}
                  onChange={(event, newAlignment) =>
                    field.onChange(newAlignment)
                  }
                >
                  <ToggleButton value="employee">Працівник</ToggleButton>
                  <ToggleButton value="employer">Роботодавець</ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Link component={RouterLink} to={'/sign-in'}>
              Увійти
            </Link>
          </Grid>
          <Grid item>
            <Button color={'primary'} variant={'contained'} type={'submit'}>
              Зареєструватися
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default SignUpPage
