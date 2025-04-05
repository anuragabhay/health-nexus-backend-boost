
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Define validation schema for appointments
const appointmentFormSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  appointment_date: z.string().min(1, "Date and time are required"),
  purpose: z.string().min(1, "Purpose is required"),
  doctor_name: z.string().min(1, "Doctor is required"),
  status: z.string().optional(),
  notes: z.string().optional(),
});

interface AppointmentFormProps {
  appointment?: any;
  patients: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  appointment, 
  patients, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: appointment ? {
      patient_id: appointment.patient_id || '',
      appointment_date: appointment.appointment_date ? new Date(appointment.appointment_date).toISOString().substring(0, 16) : '',
      purpose: appointment.purpose || '',
      doctor_name: appointment.doctor_name || '',
      status: appointment.status || 'scheduled',
      notes: appointment.notes || '',
    } : {
      patient_id: '',
      appointment_date: '',
      purpose: '',
      doctor_name: '',
      status: 'scheduled',
      notes: '',
    }
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.length > 0 ? (
                      patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {`${patient.first_name} ${patient.last_name}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="mock-1">John Doe</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="appointment_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Input placeholder="Check-up, Follow-up, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doctor_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {appointment && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="inProgress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {appointment ? 'Updating...' : 'Schedule Appointment'}
              </>
            ) : (
              appointment ? 'Update Appointment' : 'Schedule Appointment'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentForm;
