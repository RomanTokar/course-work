import { OrganizationType } from '../models/organization'
import { UserType } from '../models/user'
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore/lite'
import { firestore } from '../firebase'
import { EmployeeType } from '../models/employee'

export const getEmployeesAPI = async (
  userId: UserType['id'],
  organizationId: OrganizationType['id'],
  employeeIds: EmployeeType['id'][]
) => {
  return await Promise.all(
    employeeIds.map(async employeeId => {
      const employeeDoc = await getDoc(doc(firestore, `users/${employeeId}`))

      return { ...employeeDoc.data(), id: employeeDoc.id } as EmployeeType
    })
  )
}

export const deleteEmployeeAPI = async (
  userId: UserType['id'],
  organizationId: OrganizationType['id'],
  employeeId: EmployeeType['id']
) => {
  const organizationRef = doc(
    firestore,
    `/users/${userId}/organizations/${organizationId}`
  )
  const employeeOrganizationRef = doc(
    firestore,
    `/users/${employeeId}/organizations/${organizationId}`
  )

  await deleteDoc(employeeOrganizationRef)
  await updateDoc(organizationRef, { employeeIds: arrayRemove(employeeId) })
}

export const addEmployeeAPI = async (
  userId: UserType['id'],
  organizationId: OrganizationType['id'],
  employeeEmail: EmployeeType['email']
) => {
  const usersRef = collection(firestore, '/users')
  const q = query(usersRef, where('email', '==', employeeEmail))
  const querySnapshot = await getDocs(q)
  const employeeDoc = querySnapshot.docs[0]
  const employeeId = employeeDoc.id

  const organizationRef = doc(
    firestore,
    `/users/${userId}/organizations/${organizationId}`
  )
  const employeeOrganizationRef = doc(
    firestore,
    `/users/${employeeId}/organizations/${organizationId}`
  )

  await setDoc(employeeOrganizationRef, { employerId: userId, organizationId })
  await updateDoc(organizationRef, { employeeIds: arrayUnion(employeeId) })

  return { ...employeeDoc.data(), id: employeeId } as EmployeeType
}
