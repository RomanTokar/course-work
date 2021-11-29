import { UserType } from './user'

export type SignUpData = Pick<UserType, 'firstName' | 'lastName' | 'email' | 'role'> & {
  password: string
}

export type SignInData = Pick<UserType, 'email'> & {
  password: string
}
