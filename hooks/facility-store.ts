export interface PatientAssignment {
  id: string
  facilityId: string
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone: string
  assignedDate: string
  status: "active" | "inactive"
  notes?: string
}

export interface MedicationDelivery {
  id: string
  facilityId: string
  patientId: string
  medicationId: string
  medicationName: string
  quantity: number
  deliveryDate: string
  deliveredDate?: string
  status: "pending" | "delivered" | "failed"
  notes?: string
}

let patientAssignments: PatientAssignment[] = []
let medicationDeliveries: MedicationDelivery[] = []

export const facilityStore = {
  assignPatient: (assignment: PatientAssignment) => {
    patientAssignments.push(assignment)
    localStorage.setItem("meditext_patient_assignments", JSON.stringify(patientAssignments))
  },

  getPatientsByFacility: (facilityId: string) => {
    const stored = localStorage.getItem("meditext_patient_assignments")
    if (stored) {
      patientAssignments = JSON.parse(stored)
    }
    return patientAssignments.filter((a) => a.facilityId === facilityId && a.status === "active")
  },

  unassignPatient: (assignmentId: string) => {
    const index = patientAssignments.findIndex((a) => a.id === assignmentId)
    if (index !== -1) {
      patientAssignments[index].status = "inactive"
      localStorage.setItem("meditext_patient_assignments", JSON.stringify(patientAssignments))
    }
  },

  addMedicationDelivery: (delivery: MedicationDelivery) => {
    medicationDeliveries.push(delivery)
    localStorage.setItem("meditext_medication_deliveries", JSON.stringify(medicationDeliveries))
  },

  getDeliveriesByFacility: (facilityId: string) => {
    const stored = localStorage.getItem("meditext_medication_deliveries")
    if (stored) {
      medicationDeliveries = JSON.parse(stored)
    }
    return medicationDeliveries.filter((d) => d.facilityId === facilityId)
  },

  updateDeliveryStatus: (deliveryId: string, status: "pending" | "delivered" | "failed", deliveredDate?: string) => {
    const index = medicationDeliveries.findIndex((d) => d.id === deliveryId)
    if (index !== -1) {
      medicationDeliveries[index].status = status
      if (deliveredDate) {
        medicationDeliveries[index].deliveredDate = deliveredDate
      }
      localStorage.setItem("meditext_medication_deliveries", JSON.stringify(medicationDeliveries))
    }
  },

  getDeliveryStats: (facilityId: string) => {
    const deliveries = medicationDeliveries.filter((d) => d.facilityId === facilityId)
    const delivered = deliveries.filter((d) => d.status === "delivered").length
    const pending = deliveries.filter((d) => d.status === "pending").length
    const failed = deliveries.filter((d) => d.status === "failed").length
    return { delivered, pending, failed, total: deliveries.length }
  },
}
