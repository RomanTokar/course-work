import React from 'react'
import Header from '../../components/header'
import { Redirect, Route, Switch } from 'react-router-dom'
import ReportsPage from './employee/reports.page'
import { useAppSelector } from '../../store'
import EmployerOrganizationsPage from './employer/organizations.page'
import EmployeeOrganizationsPage from './employee/organizations.page'
import EditOrganizationPage from './employer/edit-organization.page'
import SettingsPage from './common/settings.page'
import EmployeeReportsPage from './employer/employee-reports.page'

const AuthPages = () => {
  const role = useAppSelector(state => state.auth.user?.role)

  return (
    <>
      <Header />
      <Switch>
        <Route exact path={'/settings'} component={SettingsPage} />
        {role === 'employee' ? (
          <Switch>
            <Route
              exact
              path={'/organizations/:organizationId/reports'}
              component={ReportsPage}
            />
            <Route
              exact
              path={'/organizations'}
              component={EmployeeOrganizationsPage}
            />
            <Redirect to={'/organizations'} />
          </Switch>
        ) : (
          <Switch>
            <Route
              exact
              path={'/organizations/:id/edit'}
              component={EditOrganizationPage}
            />
            <Route
              exact
              path={'/organizations'}
              component={EmployerOrganizationsPage}
            />
            <Route
              exact
              path={'/organizations/:organizationId/employee/:id/reports'}
              component={EmployeeReportsPage}
            />
            <Redirect to={'/organizations'} />
          </Switch>
        )}
      </Switch>
    </>
  )
}

export default AuthPages
