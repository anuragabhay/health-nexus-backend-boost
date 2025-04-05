
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Generic error handler for API calls
const handleApiError = (error: any, customMessage?: string) => {
  console.error("API Error:", error);
  toast({
    title: "Error",
    description: customMessage || "An unexpected error occurred. Please try again.",
    variant: "destructive",
  });
};

// Dashboard services
export const fetchDashboardMetrics = async () => {
  try {
    // Use mock data for dashboard metrics until we create a dashboard_metrics table
    return [
      { metric_name: 'Total Patients', metric_value: 458 },
      { metric_name: 'Beds Occupied', metric_value: 87 },
      { metric_name: 'Beds Available', metric_value: 23 },
      { metric_name: 'Appointments Today', metric_value: 42 },
      { metric_name: 'Emergency Cases', metric_value: 8 },
      { metric_name: 'Revenue This Month', metric_value: 187500 },
      { metric_name: 'Doctors On Duty', metric_value: 15 },
      { metric_name: 'Nurses On Duty', metric_value: 32 },
      { metric_name: 'Pending Bills', metric_value: 67 },
      { metric_name: 'Lab Tests Today', metric_value: 28 },
      { metric_name: 'ICU Occupancy', metric_value: 75 }
    ];
  } catch (error) {
    handleApiError(error, "Failed to fetch dashboard metrics");
    return [];
  }
};

// Patient services
export const fetchPatients = async (searchTerm?: string) => {
  try {
    let query = supabase.from("patients").select("*");
    
    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch patients");
    return [];
  }
};

export const fetchPatientById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to fetch patient details");
    return null;
  }
};

export const createPatient = async (patientData: any) => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .insert(patientData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create patient");
    throw error;
  }
};

export const updatePatient = async (id: string, patientData: any) => {
  try {
    const { data, error } = await supabase
      .from("patients")
      .update(patientData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update patient");
    throw error;
  }
};

export const deletePatient = async (id: string) => {
  try {
    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete patient");
    throw error;
  }
};

// Ward and bed services
export const fetchWards = async () => {
  try {
    const { data, error } = await supabase
      .from("wards")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch wards");
    return [];
  }
};

export const createWard = async (wardData: any) => {
  try {
    const { data, error } = await supabase
      .from("wards")
      .insert(wardData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create ward");
    throw error;
  }
};

export const updateWard = async (id: string, wardData: any) => {
  try {
    const { data, error } = await supabase
      .from("wards")
      .update(wardData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update ward");
    throw error;
  }
};

export const deleteWard = async (id: string) => {
  try {
    const { error } = await supabase
      .from("wards")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete ward");
    throw error;
  }
};

export const fetchBeds = async (wardId?: string) => {
  try {
    let query = supabase.from("beds").select(`
      *,
      wards:ward_id(id, name)
    `);
    
    if (wardId) {
      query = query.eq("ward_id", wardId);
    }
    
    const { data, error } = await query.order("bed_number");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch beds");
    return [];
  }
};

export const createBed = async (bedData: any) => {
  try {
    const { data, error } = await supabase
      .from("beds")
      .insert(bedData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create bed");
    throw error;
  }
};

export const updateBed = async (id: string, bedData: any) => {
  try {
    const { data, error } = await supabase
      .from("beds")
      .update(bedData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update bed");
    throw error;
  }
};

export const deleteBed = async (id: string) => {
  try {
    const { error } = await supabase
      .from("beds")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete bed");
    throw error;
  }
};

export const fetchBedAssignments = async (status?: string) => {
  try {
    let query = supabase.from("bed_assignments").select(`
      *,
      patients:patient_id(id, first_name, last_name),
      beds:bed_id(id, bed_number, ward_id, wards:ward_id(id, name))
    `);
    
    if (status) {
      query = query.eq("status", status);
    }
    
    const { data, error } = await query.order("admission_date", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch bed assignments");
    return [];
  }
};

export const createBedAssignment = async (assignmentData: any) => {
  try {
    // Update bed status to occupied
    const updateBedResponse = await supabase
      .from("beds")
      .update({ status: "occupied" })
      .eq("id", assignmentData.bed_id);
    
    if (updateBedResponse.error) throw updateBedResponse.error;
    
    // Create the bed assignment
    const { data, error } = await supabase
      .from("bed_assignments")
      .insert(assignmentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create bed assignment");
    throw error;
  }
};

export const updateBedAssignment = async (id: string, assignmentData: any) => {
  try {
    const { data, error } = await supabase
      .from("bed_assignments")
      .update(assignmentData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    // If discharge is completed, update bed status to available
    if (assignmentData.status === "discharged" && assignmentData.actual_discharge_date) {
      const updateBedResponse = await supabase
        .from("beds")
        .update({ status: "available" })
        .eq("id", data.bed_id);
      
      if (updateBedResponse.error) throw updateBedResponse.error;
    }
    
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update bed assignment");
    throw error;
  }
};

export const deleteBedAssignment = async (id: string, bedId: string) => {
  try {
    const { error } = await supabase
      .from("bed_assignments")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    // Update bed status back to available
    const updateBedResponse = await supabase
      .from("beds")
      .update({ status: "available" })
      .eq("id", bedId);
    
    if (updateBedResponse.error) throw updateBedResponse.error;
    
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete bed assignment");
    throw error;
  }
};

// Laboratory services
export const fetchLabTests = async (searchTerm?: string) => {
  try {
    let query = supabase.from("lab_tests").select("*");
    
    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }
    
    const { data, error } = await query.order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch lab tests");
    return [];
  }
};

export const createLabTest = async (testData: any) => {
  try {
    const { data, error } = await supabase
      .from("lab_tests")
      .insert(testData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create lab test");
    throw error;
  }
};

export const updateLabTest = async (id: string, testData: any) => {
  try {
    const { data, error } = await supabase
      .from("lab_tests")
      .update(testData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update lab test");
    throw error;
  }
};

export const deleteLabTest = async (id: string) => {
  try {
    const { error } = await supabase
      .from("lab_tests")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete lab test");
    throw error;
  }
};

// Medication services
export const fetchMedications = async (searchTerm?: string) => {
  try {
    let query = supabase.from("medications").select("*");
    
    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }
    
    const { data, error } = await query.order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch medications");
    return [];
  }
};

export const createMedication = async (medicationData: any) => {
  try {
    const { data, error } = await supabase
      .from("medications")
      .insert(medicationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create medication");
    throw error;
  }
};

export const updateMedication = async (id: string, medicationData: any) => {
  try {
    const { data, error } = await supabase
      .from("medications")
      .update(medicationData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update medication");
    throw error;
  }
};

export const deleteMedication = async (id: string) => {
  try {
    const { error } = await supabase
      .from("medications")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete medication");
    throw error;
  }
};

// Radiology services
export const fetchRadiologyExams = async (searchTerm?: string) => {
  try {
    let query = supabase.from("radiology_exams").select("*");
    
    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }
    
    const { data, error } = await query.order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch radiology exams");
    return [];
  }
};

export const createRadiologyExam = async (examData: any) => {
  try {
    const { data, error } = await supabase
      .from("radiology_exams")
      .insert(examData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create radiology exam");
    throw error;
  }
};

export const updateRadiologyExam = async (id: string, examData: any) => {
  try {
    const { data, error } = await supabase
      .from("radiology_exams")
      .update(examData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update radiology exam");
    throw error;
  }
};

export const deleteRadiologyExam = async (id: string) => {
  try {
    const { error } = await supabase
      .from("radiology_exams")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete radiology exam");
    throw error;
  }
};

// The following use mock data for tables that don't exist yet in Supabase

// Appointment services
export const fetchAppointments = async (filterOptions?: { 
  startDate?: string, 
  endDate?: string, 
  doctorId?: string, 
  status?: string 
}) => {
  try {
    // Mock data for appointments
    const mockAppointments = [
      {
        id: "1",
        patient_id: "1",
        patient_name: "John Doe",
        appointment_date: "2025-04-10T09:00:00",
        purpose: "General Checkup",
        status: "scheduled",
        doctor_name: "Dr. Smith"
      },
      {
        id: "2",
        patient_id: "2",
        patient_name: "Jane Smith",
        appointment_date: "2025-04-11T10:30:00",
        purpose: "Follow-up",
        status: "completed",
        doctor_name: "Dr. Johnson"
      },
      {
        id: "3",
        patient_id: "3",
        patient_name: "Robert Brown",
        appointment_date: "2025-04-08T14:15:00",
        purpose: "Consultation",
        status: "cancelled",
        doctor_name: "Dr. Williams"
      }
    ];
    
    // Filter by date range
    let filteredAppointments = [...mockAppointments];
    if (filterOptions?.startDate) {
      filteredAppointments = filteredAppointments.filter(app => 
        new Date(app.appointment_date) >= new Date(filterOptions.startDate!)
      );
    }
    if (filterOptions?.endDate) {
      filteredAppointments = filteredAppointments.filter(app => 
        new Date(app.appointment_date) <= new Date(filterOptions.endDate!)
      );
    }
    if (filterOptions?.status) {
      filteredAppointments = filteredAppointments.filter(app => 
        app.status === filterOptions.status
      );
    }
    
    return filteredAppointments;
  } catch (error) {
    handleApiError(error, "Failed to fetch appointments");
    return [];
  }
};

export const createAppointment = async (appointmentData: any) => {
  try {
    // Mock creating an appointment
    console.log("Creating appointment:", appointmentData);
    const newAppointment = { 
      id: Date.now().toString(), 
      ...appointmentData,
      patient_name: "Patient Name" // In a real app this would be fetched from the patient record
    };
    
    // Show success toast
    toast({
      title: "Success",
      description: "Appointment created successfully",
    });
    
    return newAppointment;
  } catch (error) {
    handleApiError(error, "Failed to create appointment");
    throw error;
  }
};

export const updateAppointment = async (id: string, appointmentData: any) => {
  try {
    // Mock updating an appointment
    console.log("Updating appointment:", id, appointmentData);
    
    // Show success toast
    toast({
      title: "Success",
      description: "Appointment updated successfully",
    });
    
    return { id, ...appointmentData };
  } catch (error) {
    handleApiError(error, "Failed to update appointment");
    throw error;
  }
};

export const deleteAppointment = async (id: string) => {
  try {
    // Mock deleting an appointment
    console.log("Deleting appointment:", id);
    
    // Show success toast
    toast({
      title: "Success",
      description: "Appointment deleted successfully",
    });
    
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete appointment");
    throw error;
  }
};

// Staff services
export const fetchStaff = async (searchTerm?: string, role?: string) => {
  try {
    // Mock data for staff
    const mockStaff = [
      {
        id: "1",
        first_name: "Sarah",
        last_name: "Johnson",
        role: "Doctor",
        specialty: "Cardiology",
        email: "sarah.johnson@example.com",
        phone: "+1 (555) 123-4567",
        status: "Active"
      },
      {
        id: "2",
        first_name: "Michael",
        last_name: "Williams",
        role: "Nurse",
        specialty: "Emergency",
        email: "michael.williams@example.com",
        phone: "+1 (555) 987-6543",
        status: "Active"
      },
      {
        id: "3",
        first_name: "Jessica",
        last_name: "Brown",
        role: "Doctor",
        specialty: "Pediatrics",
        email: "jessica.brown@example.com",
        phone: "+1 (555) 456-7890",
        status: "On Leave"
      },
      {
        id: "4",
        first_name: "David",
        last_name: "Miller",
        role: "Technician",
        specialty: "Radiology",
        email: "david.miller@example.com",
        phone: "+1 (555) 234-5678",
        status: "Active"
      }
    ];
    
    // Filter by search term
    let filteredStaff = [...mockStaff];
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredStaff = filteredStaff.filter(staff => 
        staff.first_name.toLowerCase().includes(searchTermLower) || 
        staff.last_name.toLowerCase().includes(searchTermLower) || 
        staff.email.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filter by role
    if (role) {
      filteredStaff = filteredStaff.filter(staff => staff.role === role);
    }
    
    return filteredStaff;
  } catch (error) {
    handleApiError(error, "Failed to fetch staff");
    return [];
  }
};

export const createStaff = async (staffData: any) => {
  try {
    // Mock creating a staff member
    console.log("Creating staff:", staffData);
    
    // Show success toast
    toast({
      title: "Success",
      description: "Staff member created successfully",
    });
    
    return { id: Date.now().toString(), ...staffData };
  } catch (error) {
    handleApiError(error, "Failed to create staff");
    throw error;
  }
};

export const updateStaff = async (id: string, staffData: any) => {
  try {
    // Mock updating a staff member
    console.log("Updating staff:", id, staffData);
    
    // Show success toast
    toast({
      title: "Success",
      description: "Staff member updated successfully",
    });
    
    return { id, ...staffData };
  } catch (error) {
    handleApiError(error, "Failed to update staff");
    throw error;
  }
};

export const deleteStaff = async (id: string) => {
  try {
    // Mock deleting a staff member
    console.log("Deleting staff:", id);
    
    // Show success toast
    toast({
      title: "Success",
      description: "Staff member deleted successfully",
    });
    
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete staff");
    throw error;
  }
};

// Mock services for other modules

// Medical Records services
export const fetchMedicalRecords = async (patientId?: string) => {
  try {
    // Mock data for medical records
    const mockRecords = [
      {
        id: "1",
        patient_id: "1",
        patient_name: "John Doe",
        record_date: "2025-03-15T10:00:00",
        doctor_name: "Dr. Smith",
        diagnosis: "Common Cold",
        notes: "Patient presented with cough and runny nose."
      },
      {
        id: "2",
        patient_id: "2",
        patient_name: "Jane Smith",
        record_date: "2025-03-20T14:30:00",
        doctor_name: "Dr. Johnson",
        diagnosis: "Hypertension",
        notes: "Blood pressure elevated. Prescribed medication and lifestyle changes."
      }
    ];
    
    // Filter by patient ID if provided
    if (patientId) {
      return mockRecords.filter(record => record.patient_id === patientId);
    }
    
    return mockRecords;
  } catch (error) {
    handleApiError(error, "Failed to fetch medical records");
    return [];
  }
};

// Billing services
export const fetchBillingRecords = async (patientId?: string, paymentStatus?: string) => {
  try {
    // Mock data for billing records
    const mockBillings = [
      {
        id: "1",
        patient_id: "1",
        patient_name: "John Doe",
        invoice_date: "2025-03-15",
        amount: 250.00,
        payment_status: "Paid",
        items: [
          { description: "Consultation", amount: 100.00 },
          { description: "Blood Test", amount: 150.00 }
        ]
      },
      {
        id: "2",
        patient_id: "2",
        patient_name: "Jane Smith",
        invoice_date: "2025-03-20",
        amount: 500.00,
        payment_status: "Pending",
        items: [
          { description: "X-Ray", amount: 300.00 },
          { description: "Medication", amount: 200.00 }
        ]
      }
    ];
    
    // Apply filters
    let filtered = [...mockBillings];
    if (patientId) {
      filtered = filtered.filter(bill => bill.patient_id === patientId);
    }
    if (paymentStatus) {
      filtered = filtered.filter(bill => bill.payment_status === paymentStatus);
    }
    
    return filtered;
  } catch (error) {
    handleApiError(error, "Failed to fetch billing records");
    return [];
  }
};

// Inventory services
export const fetchInventoryItems = async (category?: string) => {
  try {
    // Mock data for inventory items
    const mockInventory = [
      {
        id: "1",
        name: "Surgical Masks",
        category: "PPE",
        quantity: 500,
        unit: "pieces",
        reorder_level: 100,
        status: "In Stock"
      },
      {
        id: "2",
        name: "Hand Sanitizer",
        category: "Hygiene",
        quantity: 200,
        unit: "bottles",
        reorder_level: 50,
        status: "In Stock"
      },
      {
        id: "3",
        name: "Syringes",
        category: "Medical Supplies",
        quantity: 1000,
        unit: "pieces",
        reorder_level: 200,
        status: "In Stock"
      }
    ];
    
    // Filter by category if provided
    if (category) {
      return mockInventory.filter(item => item.category === category);
    }
    
    return mockInventory;
  } catch (error) {
    handleApiError(error, "Failed to fetch inventory items");
    return [];
  }
};

// Emergency services
export const fetchEmergencyCases = async (status?: string) => {
  try {
    // Mock data for emergency cases
    const mockCases = [
      {
        id: "1",
        patient_name: "Robert Johnson",
        arrival_time: "2025-04-05T08:30:00",
        condition: "Cardiac Arrest",
        severity: "Critical",
        attending_doctor: "Dr. Sarah Johnson",
        status: "In Treatment"
      },
      {
        id: "2",
        patient_name: "Emily Davis",
        arrival_time: "2025-04-05T09:15:00",
        condition: "Broken Leg",
        severity: "Moderate",
        attending_doctor: "Dr. Michael Williams",
        status: "Waiting"
      }
    ];
    
    // Filter by status if provided
    if (status) {
      return mockCases.filter(case_ => case_.status === status);
    }
    
    return mockCases;
  } catch (error) {
    handleApiError(error, "Failed to fetch emergency cases");
    return [];
  }
};

export const fetchAmbulances = async (status?: string) => {
  try {
    // Mock data for ambulances
    const mockAmbulances = [
      {
        id: "1",
        vehicle_number: "AMB-001",
        driver_name: "John Smith",
        status: "Available",
        last_maintenance: "2025-03-01"
      },
      {
        id: "2",
        vehicle_number: "AMB-002",
        driver_name: "Mike Johnson",
        status: "On Call",
        last_maintenance: "2025-03-15"
      },
      {
        id: "3",
        vehicle_number: "AMB-003",
        driver_name: "David Brown",
        status: "Maintenance",
        last_maintenance: "2025-04-01"
      }
    ];
    
    // Filter by status if provided
    if (status) {
      return mockAmbulances.filter(amb => amb.status === status);
    }
    
    return mockAmbulances;
  } catch (error) {
    handleApiError(error, "Failed to fetch ambulances");
    return [];
  }
};

// Insurance services
export const fetchInsurancePlans = async () => {
  try {
    // Mock data for insurance plans
    return [
      {
        id: "1",
        name: "Basic Health Plan",
        coverage: "70%",
        monthly_premium: 150,
        description: "Basic coverage for essential medical services"
      },
      {
        id: "2",
        name: "Premium Health Plan",
        coverage: "90%",
        monthly_premium: 300,
        description: "Comprehensive coverage including specialized treatments"
      },
      {
        id: "3",
        name: "Family Health Plan",
        coverage: "80%",
        monthly_premium: 450,
        description: "Coverage for the entire family with additional benefits"
      }
    ];
  } catch (error) {
    handleApiError(error, "Failed to fetch insurance plans");
    return [];
  }
};

export const fetchPatientInsurance = async (patientId: string) => {
  try {
    // Mock data for patient insurance
    return [
      {
        id: "1",
        patient_id: patientId,
        insurance_provider: "HealthGuard",
        policy_number: "HG123456",
        plan_name: "Premium Health Plan",
        coverage_start_date: "2025-01-01",
        coverage_end_date: "2025-12-31"
      }
    ];
  } catch (error) {
    handleApiError(error, "Failed to fetch patient insurance details");
    return [];
  }
};

// Support services
export const fetchSupportTickets = async (status?: string) => {
  try {
    // Mock data for support tickets
    const mockTickets = [
      {
        id: "1",
        subject: "System Access Issue",
        department: "IT",
        created_by: "Dr. Johnson",
        created_at: "2025-04-01T10:30:00",
        status: "Open",
        priority: "High"
      },
      {
        id: "2",
        subject: "Equipment Malfunction",
        department: "Maintenance",
        created_by: "Nurse Williams",
        created_at: "2025-04-02T14:15:00",
        status: "In Progress",
        priority: "Medium"
      },
      {
        id: "3",
        subject: "Billing Inquiry",
        department: "Finance",
        created_by: "Admin Staff",
        created_at: "2025-04-03T09:45:00",
        status: "Closed",
        priority: "Low"
      }
    ];
    
    // Filter by status if provided
    if (status) {
      return mockTickets.filter(ticket => ticket.status === status);
    }
    
    return mockTickets;
  } catch (error) {
    handleApiError(error, "Failed to fetch support tickets");
    return [];
  }
};

// Prescription services
export const fetchPrescriptions = async (patientId?: string) => {
  try {
    // Mock data for prescriptions
    const mockPrescriptions = [
      {
        id: "1",
        patient_id: "1",
        patient_name: "John Doe",
        doctor_name: "Dr. Smith",
        prescription_date: "2025-04-01",
        status: "Active"
      },
      {
        id: "2",
        patient_id: "2",
        patient_name: "Jane Smith",
        doctor_name: "Dr. Johnson",
        prescription_date: "2025-04-02",
        status: "Completed"
      }
    ];
    
    // Filter by patient ID if provided
    if (patientId) {
      return mockPrescriptions.filter(prescription => prescription.patient_id === patientId);
    }
    
    return mockPrescriptions;
  } catch (error) {
    handleApiError(error, "Failed to fetch prescriptions");
    return [];
  }
};

export const fetchPrescriptionItems = async (prescriptionId: string) => {
  try {
    // Mock data for prescription items
    return [
      {
        id: "1",
        prescription_id: prescriptionId,
        medication_name: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times a day",
        duration: "7 days",
        instructions: "Take with food"
      },
      {
        id: "2",
        prescription_id: prescriptionId,
        medication_name: "Ibuprofen",
        dosage: "400mg",
        frequency: "As needed",
        duration: "5 days",
        instructions: "Take for pain"
      }
    ];
  } catch (error) {
    handleApiError(error, "Failed to fetch prescription items");
    return [];
  }
};

// Telemedicine services
export const fetchTelemedicineSessions = async (filters?: { patientId?: string; doctorId?: string; status?: string }) => {
  try {
    // Mock data for telemedicine sessions
    const mockSessions = [
      {
        id: "1",
        patient_id: "1",
        patient_name: "John Doe",
        doctor_id: "1",
        doctor_name: "Dr. Sarah Johnson",
        scheduled_time: "2025-04-10T10:00:00",
        duration_minutes: 30,
        status: "Scheduled",
        meeting_link: "https://meet.example.com/session1"
      },
      {
        id: "2",
        patient_id: "2",
        patient_name: "Jane Smith",
        doctor_id: "3",
        doctor_name: "Dr. Jessica Brown",
        scheduled_time: "2025-04-11T14:30:00",
        duration_minutes: 45,
        status: "Completed",
        meeting_link: "https://meet.example.com/session2"
      }
    ];
    
    // Apply filters
    let filtered = [...mockSessions];
    if (filters?.patientId) {
      filtered = filtered.filter(session => session.patient_id === filters.patientId);
    }
    if (filters?.doctorId) {
      filtered = filtered.filter(session => session.doctor_id === filters.doctorId);
    }
    if (filters?.status) {
      filtered = filtered.filter(session => session.status === filters.status);
    }
    
    return filtered;
  } catch (error) {
    handleApiError(error, "Failed to fetch telemedicine sessions");
    return [];
  }
};
