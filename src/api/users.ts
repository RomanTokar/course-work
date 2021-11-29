import { UserType } from '../models/user'
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite'
import { firestore } from '../firebase'

export const updateUserAPI = async ({
  id,
  ...user
}: Omit<UserType, 'email' | 'role'>) => {
  const userRef = doc(firestore, `users/${id}`)
  await updateDoc(userRef, { ...user })
}

export const getUserAPI = async (id: UserType['id']) => {
  const userRef = doc(firestore, `users/${id}`)
  const userDoc = await getDoc(userRef)

  return { ...userDoc.data(), id: userDoc.id } as UserType
}
