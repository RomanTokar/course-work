import React, { forwardRef, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material'

const InputPassword = forwardRef((props: TextFieldProps, ref: any) => {
  const [show, setShow] = useState(false)

  return (
    <TextField
      ref={ref}
      type={show ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShow(prev => !prev)}
              edge="end"
            >
              {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  )
})

export default InputPassword
