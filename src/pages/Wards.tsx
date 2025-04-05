
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { fetchWards, createWard, updateWard, deleteWard, fetchBeds, createBed, updateBed, deleteBed } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Plus, Search, Pencil, Trash2, BedDouble, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define validation schemas
const wardFormSchema = z.object({
  name: z.string().min(1, "Ward name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  description: z.string().optional(),
});

const bedFormSchema = z.object({
  bed_number: z.string().min(1, "Bed number is required"),
  ward_id: z.string().min(1, "Ward is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
});

const Wards = () => {
  const [activeTab, setActiveTab] = useState('wards');
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [isWardDialogOpen, setIsWardDialogOpen] = useState(false);
  const [isWardDeleteDialogOpen, setIsWardDeleteDialogOpen] = useState(false);
  const [isBedDialogOpen, setIsBedDialogOpen] = useState(false);
  const [isBedDeleteDialogOpen, setIsBedDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: wards, isLoading: isLoadingWards, refetch: refetchWards } = useQuery({
    queryKey: ['wards'],
    queryFn: () => fetchWards(),
  });

  const { data: beds, isLoading: isLoadingBeds, refetch: refetchBeds } = useQuery({
    queryKey: ['beds'],
    queryFn: () => fetchBeds(),
  });

  // Ward form
  const wardForm = useForm<z.infer<typeof wardFormSchema>>({
    resolver: zodResolver(wardFormSchema),
    defaultValues: {
      name: '',
      capacity: 10,
      description: '',
    },
  });

  // Bed form
  const bedForm = useForm<z.infer<typeof bedFormSchema>>({
    resolver: zodResolver(bedFormSchema),
    defaultValues: {
      bed_number: '',
      ward_id: '',
      status: 'available',
      notes: '',
    },
  });

  // Reset forms when dialogs close
  React.useEffect(() => {
    if (!isWardDialogOpen) {
      if (selectedWard) {
        setSelectedWard(null);
      }
      wardForm.reset({
        name: '',
        capacity: 10,
        description: '',
      });
    } else if (selectedWard) {
      wardForm.reset({
        name: selectedWard.name,
        capacity: selectedWard.capacity,
        description: selectedWard.description || '',
      });
    }
  }, [isWardDialogOpen, selectedWard, wardForm]);

  React.useEffect(() => {
    if (!isBedDialogOpen) {
      if (selectedBed) {
        setSelectedBed(null);
      }
      bedForm.reset({
        bed_number: '',
        ward_id: '',
        status: 'available',
        notes: '',
      });
    } else if (selectedBed) {
      bedForm.reset({
        bed_number: selectedBed.bed_number,
        ward_id: selectedBed.ward_id,
        status: selectedBed.status,
        notes: selectedBed.notes || '',
      });
    }
  }, [isBedDialogOpen, selectedBed, bedForm]);

  // Ward operations
  const handleCreateWard = async (data: z.infer<typeof wardFormSchema>) => {
    try {
      setIsSubmitting(true);
      await createWard(data);
      refetchWards();
      setIsWardDialogOpen(false);
      toast({
        title: "Success",
        description: "Ward created successfully",
      });
    } catch (error) {
      console.error("Error creating ward:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWard = async (data: z.infer<typeof wardFormSchema>) => {
    if (!selectedWard) return;
    
    try {
      setIsSubmitting(true);
      await updateWard(selectedWard.id, data);
      refetchWards();
      setIsWardDialogOpen(false);
      toast({
        title: "Success",
        description: "Ward updated successfully",
      });
    } catch (error) {
      console.error("Error updating ward:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWard = async () => {
    if (!selectedWard) return;
    
    try {
      setIsSubmitting(true);
      await deleteWard(selectedWard.id);
      refetchWards();
      setIsWardDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Ward deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting ward:", error);
      toast({
        title: "Error",
        description: "Cannot delete ward with assigned beds",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bed operations
  const handleCreateBed = async (data: z.infer<typeof bedFormSchema>) => {
    try {
      setIsSubmitting(true);
      await createBed(data);
      refetchBeds();
      setIsBedDialogOpen(false);
      toast({
        title: "Success",
        description: "Bed created successfully",
      });
    } catch (error) {
      console.error("Error creating bed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBed = async (data: z.infer<typeof bedFormSchema>) => {
    if (!selectedBed) return;
    
    try {
      setIsSubmitting(true);
      await updateBed(selectedBed.id, data);
      refetchBeds();
      setIsBedDialogOpen(false);
      toast({
        title: "Success",
        description: "Bed updated successfully",
      });
    } catch (error) {
      console.error("Error updating bed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBed = async () => {
    if (!selectedBed) return;
    
    try {
      setIsSubmitting(true);
      await deleteBed(selectedBed.id);
      refetchBeds();
      setIsBedDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Bed deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting bed:", error);
      toast({
        title: "Error",
        description: "Cannot delete bed that is currently occupied",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onWardSubmit = selectedWard ? handleUpdateWard : handleCreateWard;
  const onBedSubmit = selectedBed ? handleUpdateBed : handleCreateBed;

  return (
    <MainLayout>
      <PageHeader 
        title="Wards & Beds" 
        description="Manage hospital wards and bed assignments"
        actions={
          activeTab === 'wards' ? (
            <Button onClick={() => setIsWardDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ward
            </Button>
          ) : (
            <Button onClick={() => setIsBedDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bed
            </Button>
          )
        }
      />
      
      <Tabs defaultValue="wards" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="wards">Wards</TabsTrigger>
          <TabsTrigger value="beds">Beds</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wards">
          {isLoadingWards ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading wards...</p>
            </div>
          ) : (
            <>
              {wards && wards.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wards.map((ward) => (
                        <TableRow key={ward.id}>
                          <TableCell className="font-medium">{ward.name}</TableCell>
                          <TableCell>{ward.capacity}</TableCell>
                          <TableCell>{ward.description || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setSelectedWard(ward);
                                  setIsWardDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setSelectedWard(ward);
                                  setIsWardDeleteDialogOpen(true);
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
                  <p className="text-muted-foreground mb-2">No wards found</p>
                  <Button onClick={() => setIsWardDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ward
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="beds">
          {isLoadingBeds ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading beds...</p>
            </div>
          ) : (
            <>
              {beds && beds.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bed Number</TableHead>
                        <TableHead>Ward</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {beds.map((bed) => (
                        <TableRow key={bed.id}>
                          <TableCell className="font-medium">{bed.bed_number}</TableCell>
                          <TableCell>{bed.wards?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              bed.status === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{bed.notes || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setSelectedBed(bed);
                                  setIsBedDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setSelectedBed(bed);
                                  setIsBedDeleteDialogOpen(true);
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
                  <p className="text-muted-foreground mb-2">No beds found</p>
                  <Button onClick={() => setIsBedDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bed
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Ward Form Dialog */}
      <Dialog open={isWardDialogOpen} onOpenChange={setIsWardDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedWard ? 'Edit Ward' : 'Add New Ward'}</DialogTitle>
            <DialogDescription>
              {selectedWard ? 'Update ward information' : 'Enter ward details below'}
            </DialogDescription>
          </DialogHeader>
          <Form {...wardForm}>
            <form onSubmit={wardForm.handleSubmit(onWardSubmit)} className="space-y-4">
              <FormField
                control={wardForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cardiology Ward" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={wardForm.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Number of beds" 
                        {...field} 
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 1 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={wardForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsWardDialogOpen(false)}
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
                      {selectedWard ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    selectedWard ? 'Update Ward' : 'Create Ward'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Ward Delete Dialog */}
      <Dialog open={isWardDeleteDialogOpen} onOpenChange={setIsWardDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ward? This action cannot be undone and may affect bed assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsWardDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteWard}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Ward'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bed Form Dialog */}
      <Dialog open={isBedDialogOpen} onOpenChange={setIsBedDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedBed ? 'Edit Bed' : 'Add New Bed'}</DialogTitle>
            <DialogDescription>
              {selectedBed ? 'Update bed information' : 'Enter bed details below'}
            </DialogDescription>
          </DialogHeader>
          <Form {...bedForm}>
            <form onSubmit={bedForm.handleSubmit(onBedSubmit)} className="space-y-4">
              <FormField
                control={bedForm.control}
                name="bed_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A-101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={bedForm.control}
                name="ward_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select ward</option>
                        {wards?.map((ward) => (
                          <option key={ward.id} value={ward.id}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={bedForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={bedForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsBedDialogOpen(false)}
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
                      {selectedBed ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    selectedBed ? 'Update Bed' : 'Create Bed'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Bed Delete Dialog */}
      <Dialog open={isBedDeleteDialogOpen} onOpenChange={setIsBedDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bed? This action cannot be undone and may affect patient assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsBedDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteBed}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Bed'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Wards;
