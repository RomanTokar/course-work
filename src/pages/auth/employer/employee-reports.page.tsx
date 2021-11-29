import React, { useEffect, useMemo } from 'react'
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import { useAppSelector } from '../../../store'
import { useDispatch } from 'react-redux'
import { ReportType } from '../../../models/report'
import {
  getEmployeeReportsThunk,
  setOrganizationId,
} from '../../../store/employee-reports-slice'
import { useParams } from 'react-router-dom'
import EmployeeDailyReports from '../../../components/employee-daily-reports'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { omit } from 'lodash-es'
import { format } from 'date-fns'

const EmployeeReportsPage = () => {
  const { organizationId } = useParams<{ organizationId: string }>()
  const { id } = useParams<{ id: string }>()
  const loading = useAppSelector(state => state.employeeReports.loading)
  const reports = useAppSelector(state => state.employeeReports.reports)
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
  const dispatch = useDispatch()

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const Heading = [
    {
      id: 'ID',
      title: 'Title',
      duration: 'Duration',
      date: 'Date',
    },
  ]

  // @ts-ignore
  const exportToCSV = (csvData, fileName, wscols) => {
    const ws = XLSX.utils.json_to_sheet(Heading, {
      header: ['id', 'title', 'duration', 'date'],
      skipHeader: true,
      // @ts-ignore
      origin: 0, //ok
    })
    ws['!cols'] = wscols
    XLSX.utils.sheet_add_json(ws, csvData, {
      header: ['id', 'title', 'duration', 'date'],
      skipHeader: true,
      origin: -1, //ok
    })
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, fileName + fileExtension)
  }

  useEffect(() => {
    dispatch(setOrganizationId(organizationId))
    dispatch(getEmployeeReportsThunk(id))
  }, [])

  const wscols = [
    { wch: Math.max(...reports.map(r => r.id.length)) },
    { wch: Math.max(...reports.map(r => r.title.length)) },
    { wch: Math.max(...reports.map(r => r.date.length)) },
    { wch: Math.max(...reports.map(r => r.duration)) },
  ]

  return (
    <Box m={2}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color={'primary'}
          variant={'contained'}
          onClick={() =>
            exportToCSV(
              reports
                .map(r =>
                  omit(
                    { ...r, date: format(new Date(r.date), 'EEEE, MMM d y') },
                    'userId'
                  )
                )
                .map(r => {
                  const hours = Math.floor(r.duration / 60)
                  const minutes = r.duration - hours * 60

                  return {
                    ...r,
                    duration: `${hours}:${minutes === 0 ? '00' : minutes}`,
                  }
                }),
              'Reports',
              wscols
            )
          }
        >
          Скласти звіт
        </Button>
      </Box>
      {loading ? (
        <CircularProgress sx={{ mx: 'auto', display: 'block' }} />
      ) : reportsEntries.length === 0 ? (
        <Typography align={'center'}>There are no reports</Typography>
      ) : (
        <Grid container direction={'column'} spacing={2}>
          {reportsEntries.map(([key, reports]) => (
            <Grid item key={key}>
              <EmployeeDailyReports reports={reports} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default EmployeeReportsPage
