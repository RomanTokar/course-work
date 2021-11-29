import React, { FC } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import { format, parse } from 'date-fns'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { ReportType } from '../models/report'
import { ReportFormData } from './add-report-form'
import { deleteReportThunk } from '../store/reports-slice'
import { useDispatch } from 'react-redux'
import Report from './report'
import EmployeeReport from './employee-report'

type EmployeeDailyReportProps = {
  reports: ReportType[]
}

const EmployeeDailyReports: FC<EmployeeDailyReportProps> = ({ reports }) => {
  const overallDuration = reports.reduce((acc, r) => acc + r.duration, 0)
  const hours = Math.floor(overallDuration / 60)
  const minutes = overallDuration - hours * 60

  return (
    <Card>
      <CardHeader
        title={format(new Date(reports[0].date), 'EEEE, MMM d y')}
        subheader={`${hours}:${minutes === 0 ? '00' : minutes}`}
      />
      <CardContent>
        <List>
          {reports.map((r, i) => (
            <EmployeeReport
              divider={i + 1 < reports.length}
              key={r.id}
              report={r}
            />
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default EmployeeDailyReports
