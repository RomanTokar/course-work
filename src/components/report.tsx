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

type ReportProps = {
  report: ReportType
  setDefaultValues: (defaultValues: ReportFormData) => void
  divider: boolean
}

const schema = object({
  title: string().required('Required'),
  duration: date().typeError('Not valid date'),
  date: date().typeError('Not valid date'),
})

const Report: FC<ReportProps> = ({ setDefaultValues, report, divider }) => {
  const dispatch = useDispatch()
  const hours = Math.floor(report.duration / 60)
  const minutes = report.duration - hours * 60
  const [editMode, setEditMode] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReportFormData>({
    mode: 'all',
    defaultValues: {
      title: report.title,
      duration: parse(
        `${hours}:${minutes === 0 ? '00' : minutes}`,
        'HH:mm',
        new Date()
      ),
      date: new Date(report.date),
    },
    resolver: yupResolver(schema),
    criteriaMode: 'all',
  })

  const deleteReport = () => {
    dispatch(deleteReportThunk(report.id))
  }

  const onSubmit = async ({
    title,
    duration,
    date,
  }: Omit<ReportFormData, 'date' | 'duration'> & {
    date: Date
    duration: Date
  }) => {
    const hours = duration.getHours()
    const minutes = duration.getMinutes()

    date.setHours(0, 0, 0, 0)

    await dispatch(
      updateReportThunk({
        id: report.id,
        title,
        duration: hours * 60 + minutes,
        date: date.toISOString(),
      })
    )
    setEditMode(false)
  }

  return (
    <ListItem divider={divider} sx={{ display: 'block' }}>
      {editMode ? (
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
                placeholder={'What have you been working on?'}
                error={!!errors?.title}
                helperText={errors?.title?.message}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={'auto'}
              sx={{
                display: { xs: 'flex', sm: 'block' },
                justifyContent: { xs: 'center' },
              }}
            >
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    inputRef={field.ref}
                    label="Date"
                    onChange={date => field.onChange(date)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        sx={{ width: 200 }}
                        error={!!errors?.date}
                        helperText={errors?.date?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <Controller
                control={control}
                name={'duration'}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    inputRef={field.ref}
                    onChange={date => field.onChange(date)}
                    label="Duration"
                    renderInput={params => (
                      <TextField
                        sx={{ width: 150 }}
                        {...params}
                        error={!!errors?.duration}
                        helperText={errors?.duration?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item>
              <IconButton type={'submit'} color={'primary'}>
                <CheckIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton color={'error'} onClick={() => setEditMode(false)}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Grid container>
          <Grid item xs>
            <Typography>{report.title}</Typography>
          </Grid>
          <Grid item xs>
            <Typography>{`${hours}:${
              minutes === 0 ? '00' : minutes
            }`}</Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="copy"
              color={'primary'}
              onClick={() =>
                setDefaultValues({
                  title: report.title,
                  duration: parse(
                    `${hours}:${minutes === 0 ? '00' : minutes}`,
                    'HH:mm',
                    new Date()
                  ),
                  date: new Date(report.date),
                })
              }
            >
              <ContentCopyIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color={'primary'}
              aria-label="edit"
              onClick={() => setEditMode(true)}
            >
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              color={'error'}
              aria-label="delete"
              onClick={deleteReport}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </ListItem>
  )
}

export default Report
