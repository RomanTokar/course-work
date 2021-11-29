import React, { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { useAppSelector } from '../../../store'
import { useDispatch } from 'react-redux'
import {
  getReportsThunk,
  setOrganizationId,
} from '../../../store/reports-slice'
import AddReportForm, {
  ReportFormData,
} from '../../../components/add-report-form'
import { parse } from 'date-fns'
import { ReportType } from '../../../models/report'
import DailyReports from '../../../components/daily-reports'
import { useParams } from 'react-router-dom'

const ReportsPage = () => {
  const { organizationId } = useParams<{ organizationId: string }>()
  const loading = useAppSelector(state => state.reports.loading)
  const reports = useAppSelector(state => state.reports.reports)
  const reportsEntries = useMemo(
    () =>
      Object.entries(
        reports.reduce((acc, r) => {
          const key = new Date(r.date).getTime().toString()

          if (acc[key]) {
            acc[key].push(r)
          } else {
            acc[key] = [r]
          }

          return acc
        }, {} as Record<string, ReportType[]>)
      ).sort((a, b) => (a[1][0].date > b[1][0].date ? -1 : 1)),
    [reports]
  )
  const [defaultValues, setDefaultValues] = useState<ReportFormData>({
    title: '',
    date: new Date(),
    duration: parse('00:00', 'HH:mm', new Date()),
  })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setOrganizationId(organizationId))
    dispatch(getReportsThunk())
  }, [])

  return (
    <Box m={2}>
      <AddReportForm defaultValues={defaultValues} />
      {loading ? (
        <CircularProgress sx={{ mx: 'auto', display: 'block' }} />
      ) : reportsEntries.length === 0 ? (
        <Typography align={'center'}>There are no reports</Typography>
      ) : (
        <Grid container direction={'column'} spacing={2}>
          {reportsEntries.map(([key, reports]) => (
            <Grid item key={key}>
              <DailyReports
                reports={reports}
                setDefaultValues={defaultValues =>
                  setDefaultValues(defaultValues)
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default ReportsPage
