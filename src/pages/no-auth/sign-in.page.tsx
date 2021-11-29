import React from 'react'
import { Box, Button, Container, Grid, Link, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { signIn } from '../../store/auth-slice'
import InputPassword from '../../components/input-password'
import { Link as RouterLink } from 'react-router-dom'
import { SignInData } from '../../models/auth'

const schema = object({
  email: string().email('Not valid email').required('Email is required'),
  password: string().required('Email is required'),
})

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })
  const dispatch = useDispatch()

  const onSubmit = async (values: SignInData) => {
    await dispatch(signIn(values))
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
          <Grid item xs={12}>
            <Link component={RouterLink} to={'/sign-up'}>
              Зареєструватися
            </Link>
          </Grid>
          <Grid item>
            <Button color={'primary'} variant={'contained'} type={'submit'}>
              Увійти
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default SignInPage
