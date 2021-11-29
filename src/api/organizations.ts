import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore/lite'
import { firestore } from '../firebase'
import { OrganizationType } from '../models/organization'
import { UserType } from '../models/user'

export const getOrganizationsAPI = async (userId: UserType['id']) => {
  const q = query(collection(firestore, `users/${userId}/organizations`))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => {
    const organization = doc.data()

    return {
      ...organization,
      id: doc.id,
    } as OrganizationType
  })
}

export const deleteOrganizationAPI = async (
  userId: UserType['id'],
  organizationId: OrganizationType['id']
) => {
  const organizationRef = doc(
    firestore,
    `users/${userId}/organizations/${organizationId}`
  )
  await deleteDoc(organizationRef)
}

export const updateOrganizationAPI = async (
  userId: UserType['id'],
  organization: Partial<OrganizationType> & Pick<OrganizationType, 'id'>
) => {
  const organizationRef = doc(
    firestore,
    `users/${userId}/organizations/${organization.id}`
  )
  await updateDoc(organizationRef, organization)
}

export const addOrganizationAPI = async (
  userId: UserType['id'],
  organization: Omit<OrganizationType, 'id'>
) => {
  const organizationsCollectionRef = collection(
    firestore,
    `users/${userId}/organizations`
  )
  return await addDoc(organizationsCollectionRef, organization)
}

export const getOrganizationAPI = async (
  userId: UserType['id'],
  organizationId: OrganizationType['id']
) => {
  const organizationDocRef = doc(
    firestore,
    `users/${userId}/organizations/${organizationId}`
  )
  const organizationDoc = await getDoc(organizationDocRef)

  return {
    ...organizationDoc.data(),
    id: organizationDoc.id,
  } as OrganizationType & { employeeIds: string[] }
}
