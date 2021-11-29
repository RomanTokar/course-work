import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import SignInPage from './sign-in.page'
import SignUpPage from './sign-up.page'

const NoAuthPages = () => {
  return (
    <Switch>
      <Route exact path={'/sign-in'} component={SignInPage} />
      <Route exact path={'/sign-up'} component={SignUpPage} />
      <Redirect to={'/sign-in'} />
    </Switch>
  )
}

export default NoAuthPages
