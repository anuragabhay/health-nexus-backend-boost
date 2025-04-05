
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAppointments, fetchPatients, createAppointment, updateAppointment, deleteAppointment } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, FilePen, Plus, Search, Trash2, User } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import AppointmentForm from '@/components/Appointments/AppointmentForm';

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['appointments', filterOptions],
    queryFn: () => fetchAppointments(filterOptions),
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => fetchPatients(),
  });

  const handleCreateAppointment = async (appointmentData: any) => {
    try {
      await createAppointment(appointmentData);
      setIsAddDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Appointment created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAppointment = async (appointmentData: any) => {
    try {
      await updateAppointment(selectedAppointment.id, appointmentData);
      setIsEditDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async () => {
    try {
      await deleteAppointment(selectedAppointment.id);
      setIsDeleteDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatAppointmentTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      inProgress: "bg-yellow-100 text-yellow-800",
    };
    
    const statusClass = statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch appointments",
      variant: "destructive",
    });
  }

  // Since we're using mock data for appointments, we'll create some sample data
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

  return (
    <MainLayout>
      <PageHeader 
        title="Appointments" 
        description="View and manage patient appointments"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        }
      />

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="pl-8"
                  value={filterOptions.startDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="pl-8"
                  value={filterOptions.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={filterOptions.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="inProgress">In Progress</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading appointments...</p>
        </div>
      ) : (
        <>
          {mockAppointments && mockAppointments.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.patient_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatAppointmentTime(appointment.appointment_date)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.purpose}</TableCell>
                      <TableCell>{appointment.doctor_name}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <FilePen className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
              <p className="text-muted-foreground mb-2">No appointments found</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add Appointment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Enter the appointment details below
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm 
            patients={patients || []}
            onSubmit={handleCreateAppointment} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Update the appointment details
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm 
            appointment={selectedAppointment}
            patients={patients || []}
            onSubmit={handleUpdateAppointment} 
            onCancel={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>No, Keep It</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAppointment}
            >
              Yes, Cancel Appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Appointments;
