import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore/lite'
import { auth, firestore } from '../firebase'
import { SignInData, SignUpData } from '../models/auth'
import { UserType } from '../models/user'
import { updateUserAPI } from '../api/users'
import { AppThunkAPIConfig } from './index'

export interface AuthState {
  user?: UserType
  isInit: boolean
  isAuth: boolean
}

const initialState: AuthState = {
  isInit: false,
  isAuth: false,
}

export const signUp = createAsyncThunk<void, SignUpData>(
  'auth/sign-up',
  async (userData, { dispatch }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      )

      dispatch(setIsAuth(true))
      dispatch(setUser({ id: user.uid, ...userData }))

      const userRef = doc(firestore, `users/${user.uid}`)
      await setDoc(userRef, { ...userData, id: user.uid })
    } catch (error) {
      console.log(error)
    }
  }
)

export const initAuth = createAsyncThunk(
  'auth/init',
  async (_, { dispatch }) => {
    try {
      auth.onAuthStateChanged(async user => {
        if (user) {
          dispatch(setIsAuth(true))

          const userRef = doc(firestore, `users/${user.uid}`)
          const userSnapshot = await getDoc(userRef)

          if (!userSnapshot.exists()) return

          dispatch(
            setUser({ ...(userSnapshot.data() as UserType), id: user.uid })
          )
        } else {
          dispatch(setIsAuth(false))
        }

        dispatch(setIsInit(true))
      })
    } catch (error) {
      console.log(error)
    }
  }
)

export const signOutThunk = createAsyncThunk('auth/sign-out', async () => {
  try {
    auth.signOut()
  } catch (error) {
    console.log(error)
  }
})

export const signIn = createAsyncThunk<void, SignInData>(
  'auth/sign-in',
  async ({ email, password }) => {
    try {
      signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.log(error)
    }
  }
)

export const updateUserThunk = createAsyncThunk<
  void,
  Omit<UserType, 'id' | 'email' | 'role'>,
  AppThunkAPIConfig
>('auth/update-user', async (values, { getState, dispatch }) => {
  try {
    const { user } = getState().auth

    if (!user) return

    await updateUserAPI({ ...values, id: user.id })
    dispatch(updateUser(values))
  } catch (error) {
    console.log(error)
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsInit(state, { payload }: PayloadAction<AuthState['isInit']>) {
      state.isInit = payload
    },
    setIsAuth(state, { payload }: PayloadAction<AuthState['isAuth']>) {
      state.isAuth = payload
    },
    setUser(state, { payload }: PayloadAction<AuthState['user']>) {
      state.user = payload
    },
    updateUser(
      state,
      { payload }: PayloadAction<Omit<UserType, 'id' | 'email' | 'role'>>
    ) {
      if (!state.user) return

      state.user = { ...state.user, ...payload }
    },
  },
})

export const { setUser, setIsAuth, setIsInit, updateUser } = authSlice.actions

export default authSlice.reducer
