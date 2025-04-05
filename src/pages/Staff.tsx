
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStaff } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { FilePen, Plus, Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import StaffForm from '@/components/Staff/StaffForm';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const { data: staff, isLoading, error, refetch } = useQuery({
    queryKey: ['staff', searchTerm, roleFilter],
    queryFn: () => fetchStaff(searchTerm, roleFilter),
  });

  const handleCreateStaff = async (staffData: any) => {
    try {
      // Implement create staff function in api.ts
      // await createStaff(staffData);
      setIsAddDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStaff = async (staffData: any) => {
    try {
      // Implement update staff function in api.ts
      // await updateStaff(selectedStaff.id, staffData);
      setIsEditDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Staff information updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff information",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStaff = async () => {
    try {
      // Implement delete staff function in api.ts
      // await deleteStaff(selectedStaff.id);
      setIsDeleteDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Staff member removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove staff member",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch staff information",
      variant: "destructive",
    });
  }

  // Mock staff data since we don't have real data yet
  const mockStaffData = [
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

  return (
    <MainLayout>
      <PageHeader 
        title="Staff" 
        description="Manage hospital staff and personnel"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        }
      />

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search staff..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full sm:w-64">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={roleFilter}
              onChange={handleRoleFilter}
            >
              <option value="">All Roles</option>
              <option value="Doctor">Doctors</option>
              <option value="Nurse">Nurses</option>
              <option value="Administrator">Administrators</option>
              <option value="Technician">Technicians</option>
              <option value="Other">Other Staff</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading staff information...</p>
        </div>
      ) : (
        <>
          {mockStaffData && mockStaffData.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStaffData.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell className="font-medium">{`${staffMember.first_name} ${staffMember.last_name}`}</TableCell>
                      <TableCell>{staffMember.role}</TableCell>
                      <TableCell>{staffMember.specialty}</TableCell>
                      <TableCell>{staffMember.email}</TableCell>
                      <TableCell>{staffMember.phone}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          staffMember.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {staffMember.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setSelectedStaff(staffMember);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <FilePen className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setSelectedStaff(staffMember);
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
              <p className="text-muted-foreground mb-2">No staff members found</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>
              Enter the staff member's information below
            </DialogDescription>
          </DialogHeader>
          <StaffForm onSubmit={handleCreateStaff} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Information</DialogTitle>
            <DialogDescription>
              Update the staff member's information
            </DialogDescription>
          </DialogHeader>
          <StaffForm 
            staff={selectedStaff} 
            onSubmit={handleUpdateStaff} 
            onCancel={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this staff member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteStaff}
            >
              Remove Staff
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Staff;
