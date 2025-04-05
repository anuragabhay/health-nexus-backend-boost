
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { fetchLabTests, createLabTest, updateLabTest, deleteLabTest, fetchPatients } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

// Define validation schema for lab tests
const labTestFormSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
});

const Laboratory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: labTests, isLoading, error, refetch } = useQuery({
    queryKey: ['lab_tests', searchTerm],
    queryFn: () => fetchLabTests(searchTerm),
  });

  // Lab test form
  const form = useForm<z.infer<typeof labTestFormSchema>>({
    resolver: zodResolver(labTestFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
    },
  });

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!isAddDialogOpen) {
      if (selectedTest) {
        setSelectedTest(null);
      }
      form.reset({
        name: '',
        description: '',
        price: 0,
      });
    } else if (selectedTest) {
      form.reset({
        name: selectedTest.name,
        description: selectedTest.description || '',
        price: selectedTest.price || 0,
      });
    }
  }, [isAddDialogOpen, selectedTest, form]);

  const handleCreateTest = async (data: z.infer<typeof labTestFormSchema>) => {
    try {
      setIsSubmitting(true);
      await createLabTest(data);
      refetch();
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Laboratory test created successfully",
      });
    } catch (error) {
      console.error("Error creating laboratory test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTest = async (data: z.infer<typeof labTestFormSchema>) => {
    if (!selectedTest) return;
    
    try {
      setIsSubmitting(true);
      await updateLabTest(selectedTest.id, data);
      refetch();
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Laboratory test updated successfully",
      });
    } catch (error) {
      console.error("Error updating laboratory test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTest = async () => {
    if (!selectedTest) return;
    
    try {
      setIsSubmitting(true);
      await deleteLabTest(selectedTest.id);
      refetch();
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Laboratory test deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting laboratory test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = selectedTest ? handleUpdateTest : handleCreateTest;

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch laboratory tests",
      variant: "destructive",
    });
  }

  return (
    <MainLayout>
      <PageHeader 
        title="Laboratory" 
        description="Manage laboratory tests and results"
        actions={
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </Button>
        }
      />

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tests..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading laboratory tests...</p>
        </div>
      ) : (
        <>
          {labTests && labTests.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{test.description || 'N/A'}</TableCell>
                      <TableCell>{test.price ? `$${test.price.toFixed(2)}` : 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setSelectedTest(test);
                              setIsAddDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              setSelectedTest(test);
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
              <p className="text-muted-foreground mb-2">No laboratory tests found</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Test
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Test Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTest ? 'Edit Laboratory Test' : 'Add New Laboratory Test'}</DialogTitle>
            <DialogDescription>
              {selectedTest ? 'Update test information' : 'Enter test details below'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Complete Blood Count" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description of the test and its purpose" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="0.00" 
                          className="pl-7"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
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
                      {selectedTest ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    selectedTest ? 'Update Test' : 'Create Test'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTest?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Test'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Laboratory;
