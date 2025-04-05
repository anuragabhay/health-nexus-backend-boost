
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
    const { data, error } = await supabase
      .from("dashboard_metrics")
      .select("*");
    
    if (error) throw error;
    return data || [];
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
    toast({
      title: "Success",
      description: "Patient created successfully",
    });
    return data;
  } catch (error) {
    handleApiError(error, "Failed to create patient");
    return null;
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
    toast({
      title: "Success",
      description: "Patient updated successfully",
    });
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update patient");
    return null;
  }
};

export const deletePatient = async (id: string) => {
  try {
    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    toast({
      title: "Success",
      description: "Patient deleted successfully",
    });
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete patient");
    return false;
  }
};

// Appointment services
export const fetchAppointments = async (filterOptions?: { 
  startDate?: string, 
  endDate?: string, 
  doctorId?: string, 
  status?: string 
}) => {
  try {
    let query = supabase
      .from("appointments")
      .select(`
        *,
        patients:patient_id(id, first_name, last_name),
        staff:doctor_id(id, first_name, last_name)
      `);
    
    if (filterOptions?.startDate) {
      query = query.gte("appointment_date", filterOptions.startDate);
    }
    
    if (filterOptions?.endDate) {
      query = query.lte("appointment_date", filterOptions.endDate);
    }
    
    if (filterOptions?.doctorId) {
      query = query.eq("doctor_id", filterOptions.doctorId);
    }
    
    if (filterOptions?.status) {
      query = query.eq("status", filterOptions.status);
    }
    
    const { data, error } = await query.order("appointment_date", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch appointments");
    return [];
  }
};

export const createAppointment = async (appointmentData: any) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert(appointmentData)
      .select()
      .single();
    
    if (error) throw error;
    toast({
      title: "Success",
      description: "Appointment scheduled successfully",
    });
    return data;
  } catch (error) {
    handleApiError(error, "Failed to schedule appointment");
    return null;
  }
};

export const updateAppointment = async (id: string, appointmentData: any) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update(appointmentData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    toast({
      title: "Success",
      description: "Appointment updated successfully",
    });
    return data;
  } catch (error) {
    handleApiError(error, "Failed to update appointment");
    return null;
  }
};

export const deleteAppointment = async (id: string) => {
  try {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    toast({
      title: "Success",
      description: "Appointment deleted successfully",
    });
    return true;
  } catch (error) {
    handleApiError(error, "Failed to delete appointment");
    return false;
  }
};

// Staff services
export const fetchStaff = async (searchTerm?: string, role?: string) => {
  try {
    let query = supabase.from("staff").select("*");
    
    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    
    if (role) {
      query = query.eq("role", role);
    }
    
    const { data, error } = await query.order("last_name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch staff");
    return [];
  }
};

// Ward and bed services
export const fetchWards = async () => {
  try {
    const { data, error } = await supabase
      .from("wards")
      .select("*");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch wards");
    return [];
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
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch beds");
    return [];
  }
};

export const fetchBedAssignments = async (status?: string) => {
  try {
    let query = supabase.from("bed_assignments").select(`
      *,
      patients:patient_id(id, first_name, last_name),
      beds:bed_id(id, bed_number, ward_id)
    `);
    
    if (status) {
      query = query.eq("status", status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch bed assignments");
    return [];
  }
};

// Medical Records services
export const fetchMedicalRecords = async (patientId?: string) => {
  try {
    let query = supabase.from("medical_records").select(`
      *,
      patients:patient_id(id, first_name, last_name),
      staff:doctor_id(id, first_name, last_name)
    `);
    
    if (patientId) {
      query = query.eq("patient_id", patientId);
    }
    
    const { data, error } = await query.order("record_date", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch medical records");
    return [];
  }
};

// Billing services
export const fetchBillingRecords = async (patientId?: string, paymentStatus?: string) => {
  try {
    let query = supabase.from("billing_records").select(`
      *,
      patients:patient_id(id, first_name, last_name)
    `);
    
    if (patientId) {
      query = query.eq("patient_id", patientId);
    }
    
    if (paymentStatus) {
      query = query.eq("payment_status", paymentStatus);
    }
    
    const { data, error } = await query.order("record_date", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch billing records");
    return [];
  }
};

// Inventory services
export const fetchInventoryItems = async (category?: string) => {
  try {
    let query = supabase.from("inventory_items").select("*");
    
    if (category) {
      query = query.eq("category", category);
    }
    
    const { data, error } = await query.order("item_name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch inventory items");
    return [];
  }
};

// Laboratory services
export const fetchLabTests = async () => {
  try {
    const { data, error } = await supabase
      .from("lab_tests")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch lab tests");
    return [];
  }
};

// Medication services
export const fetchMedications = async () => {
  try {
    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch medications");
    return [];
  }
};

// Emergency services
export const fetchEmergencyCases = async (status?: string) => {
  try {
    let query = supabase.from("emergency_cases").select(`
      *,
      patients:patient_id(id, first_name, last_name),
      staff:assigned_staff(id, first_name, last_name)
    `);
    
    if (status) {
      query = query.eq("status", status);
    }
    
    const { data, error } = await query.order("arrival_time", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch emergency cases");
    return [];
  }
};

export const fetchAmbulances = async (status?: string) => {
  try {
    let query = supabase.from("ambulance_services").select("*");
    
    if (status) {
      query = query.eq("status", status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch ambulances");
    return [];
  }
};

// Insurance services
export const fetchInsurancePlans = async () => {
  try {
    const { data, error } = await supabase
      .from("insurance_plans")
      .select("*")
      .order("plan_name", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch insurance plans");
    return [];
  }
};

export const fetchPatientInsurance = async (patientId: string) => {
  try {
    const { data, error } = await supabase
      .from("patient_insurance")
      .select(`
        *,
        insurance_plans:insurance_plan_id(id, plan_name, provider)
      `)
      .eq("patient_id", patientId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch patient insurance details");
    return [];
  }
};

// Support services
export const fetchSupportTickets = async (status?: string) => {
  try {
    let query = supabase.from("support_tickets").select(`
      *,
      raiser:raised_by(id, first_name, last_name),
      assignee:assigned_to(id, first_name, last_name)
    `);
    
    if (status) {
      query = query.eq("status", status);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch support tickets");
    return [];
  }
};

// Prescription services
export const fetchPrescriptions = async (patientId?: string) => {
  try {
    let query = supabase.from("prescriptions").select(`
      *,
      patients:patient_id(id, first_name, last_name),
      staff:doctor_id(id, first_name, last_name)
    `);
    
    if (patientId) {
      query = query.eq("patient_id", patientId);
    }
    
    const { data, error } = await query.order("prescription_date", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch prescriptions");
    return [];
  }
};

export const fetchPrescriptionItems = async (prescriptionId: string) => {
  try {
    const { data, error } = await supabase
      .from("prescription_items")
      .select(`
        *,
        medications:medication_id(id, name, description)
      `)
      .eq("prescription_id", prescriptionId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch prescription items");
    return [];
  }
};

// Telemedicine services
export const fetchTelemedicineSessions = async (filters?: { patientId?: string; doctorId?: string; status?: string }) => {
  try {
    let query = supabase.from("telemedicine_sessions").select(`
      *,
      patients:patient_id(id, first_name, last_name),
      staff:doctor_id(id, first_name, last_name)
    `);
    
    if (filters?.patientId) {
      query = query.eq("patient_id", filters.patientId);
    }
    
    if (filters?.doctorId) {
      query = query.eq("doctor_id", filters.doctorId);
    }
    
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    
    const { data, error } = await query.order("session_date", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch telemedicine sessions");
    return [];
  }
};
