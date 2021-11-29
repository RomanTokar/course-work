import { UserType } from '../models/user'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore/lite'
import { firestore } from '../firebase'
import { ReportType } from '../models/report'
import { omit } from 'lodash-es'
import { OrganizationType } from '../models/organization'

export const addReportAPI = async (
  userId: UserType['id'],
  report: Omit<ReportType, 'id'>,
  organizationId: string,
) => {
  const reportsDocRef = collection(firestore, `users/${userId}/organizations/${organizationId}/reports`)
  return await addDoc(reportsDocRef, {
    ...report,
    date: Timestamp.fromDate(new Date(report.date)),
  })
}

export const updateReportAPI = async (
  userId: UserType['id'],
  report: Pick<ReportType, 'id'> & Partial<ReportType>,
  organizationId: string,
) => {
  const reportsDocRef = doc(firestore, `users/${userId}/organizations/${organizationId}/reports/${report.id}`)
  const reportWithoutId = omit(report, 'id')
  await updateDoc(reportsDocRef, {
    ...reportWithoutId,
    ...(reportWithoutId.date && {
      date: Timestamp.fromDate(new Date(reportWithoutId.date)),
    }),
  })
}

export const deleteReportAPI = async (
  userId: UserType['id'],
  reportId: ReportType['id'],
  organizationId: string,
) => {
  const reportRef = doc(
    firestore,
    `users/${userId}/organizations/${organizationId}/reports/${reportId}`,
  )
  await deleteDoc(reportRef)
}

export const getReportsAPI = async (
  userId: UserType['id'],
  organizationId: OrganizationType['id'],
) => {
  const reportsQuery = query(
    collection(
      firestore,
      `users/${userId}/organizations/${organizationId}/reports`,
    ),
  )
  const reportQuerySnapshot = await getDocs(reportsQuery)
  return reportQuerySnapshot.docs.map(doc => {
    const report = doc.data()

    return {
      ...report,
      date: (report.date.toDate() as Date).toISOString(),
      id: doc.id,
    } as ReportType
  })
}
