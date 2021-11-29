import React, { useState } from 'react'
import {
  AppBar,
  ClickAwayListener,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Popover,
  styled,
  Toolbar,
  Typography,
} from '@mui/material'
import { useAppSelector } from '../store'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useDispatch } from 'react-redux'
import { signOutThunk } from '../store/auth-slice'
import { Link as RouterLink } from 'react-router-dom'

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)

const Header = () => {
  const isAuth = useAppSelector(state => state.auth.isAuth)
  const user = useAppSelector(state => state.auth.user)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const dispatch = useDispatch()

  const signOut = () => {
    dispatch(signOutThunk())
  }

  return (
    <>
      <AppBar position={'fixed'}>
        <Toolbar>
          {isAuth && (
            <Grid container alignItems={'center'} spacing={2}>
              <Grid item xs container spacing={2}>
                <Grid item>
                  <Link
                    component={RouterLink}
                    to={'/organizations'}
                    color={'inherit'}
                    underline={'none'}
                  >
                    <Typography>Організації</Typography>
                  </Link>
                </Grid>
              </Grid>
              <Grid item>
                <Typography>
                  {user && `${user.firstName} ${user.lastName}`}
                </Typography>
              </Grid>
              <Grid item>
                <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                  <IconButton
                    color={'inherit'}
                    onClick={event =>
                      setAnchorEl(anchorEl ? null : event.currentTarget)
                    }
                  >
                    <MoreVertIcon />
                    <Popover
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <List>
                        <ListItem button onClick={signOut}>
                          <ListItemText primary={'Вийти'} />
                        </ListItem>
                        <ListItem
                          button
                          component={RouterLink}
                          to={'/settings'}
                        >
                          <ListItemText primary={'Налаштування'} />
                        </ListItem>
                      </List>
                    </Popover>
                  </IconButton>
                </ClickAwayListener>
              </Grid>
            </Grid>
          )}
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  )
}

export default Header
