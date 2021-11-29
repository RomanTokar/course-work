import React, { useEffect } from 'react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { BrowserRouter } from 'react-router-dom'
import { useAppSelector } from './store'
import { useDispatch } from 'react-redux'
import { initAuth } from './store/auth-slice'
import { Backdrop, CircularProgress } from '@mui/material'
import AuthPages from './pages/auth'
import NoAuthPages from './pages/no-auth'

function App() {
  const isAuth = useAppSelector(state => state.auth.isAuth)
  const isInit = useAppSelector(state => state.auth.isInit)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initAuth())
  }, [])

  if (!isInit) {
    return (
      <Backdrop open>
        <CircularProgress color={'inherit'} />
      </Backdrop>
    )
  }

  return (
    <BrowserRouter>{isAuth ? <AuthPages /> : <NoAuthPages />}</BrowserRouter>
  )
}

export default App
