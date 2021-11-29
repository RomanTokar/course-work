import React, { FC, memo, useEffect } from 'react'
import { Box, Button, Grid, Paper, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { date, object, string } from 'yup'
import { DatePicker, TimePicker } from '@mui/lab'
import { addReportThunk } from '../store/reports-slice'

export type ReportFormData = {
  title: string
  date: Date | null
  duration: Date | null
}

type AddReportFormProps = {
  defaultValues: ReportFormData
}

const schema = object({
  title: string().required('Required'),
  duration: date().typeError('Not valid date'),
  date: date().typeError('Not valid date'),
})

const AddReportForm: FC<AddReportFormProps> = ({ defaultValues }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<ReportFormData>({
    defaultValues,
    resolver: yupResolver(schema),
  })
  const dispatch = useDispatch()

  useEffect(() => {
    Object.entries(defaultValues).forEach(([key, value]) => {
      setValue(key as keyof ReportFormData, value)
    })
  }, [defaultValues])

  const onSubmit = ({
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

    dispatch(
      addReportThunk({
        title,
        duration: hours * 60 + minutes,
        date: date.toISOString(),
      })
    )
    setValue('title', '')
  }

  return (
    <Box p={2} component={Paper} mb={2} sx={{ position: 'sticky', top: 80 }}>
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
              placeholder={'Над чим ви працюєте?'}
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
                  label="Дата"
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
                  label="Тривалість"
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
            <Button type={'submit'} color={'primary'} variant={'contained'}>
              Додати
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default memo(AddReportForm)
