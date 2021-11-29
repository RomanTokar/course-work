import React, { FC, useState } from 'react'
import {
  Grid,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import { parse } from 'date-fns'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch } from 'react-redux'
import { deleteReportThunk, updateReportThunk } from '../store/reports-slice'
import { ReportFormData } from './add-report-form'
import { ReportType } from '../models/report'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { date, object, string } from 'yup'
import { DatePicker, TimePicker } from '@mui/lab'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

type EmployeeReportProps = {
  report: ReportType
  divider: boolean
}

const EmployeeReport: FC<EmployeeReportProps> = ({ report, divider }) => {
  const hours = Math.floor(report.duration / 60)
  const minutes = report.duration - hours * 60

  return (
    <ListItem divider={divider} sx={{ display: 'block' }}>
      <Grid container>
        <Grid item xs>
          <Typography>{report.title}</Typography>
        </Grid>
        <Grid item xs>
          <Typography>{`${hours}:${
            minutes === 0 ? '00' : minutes
          }`}</Typography>
        </Grid>
      </Grid>
    </ListItem>
  )
}

export default EmployeeReport
