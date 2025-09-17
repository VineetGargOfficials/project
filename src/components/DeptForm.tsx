import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building2, GraduationCap, Users, Plus, X, Trash2 } from "lucide-react";
import FormHeader from "./FormHeader";

// Demo faculty options
const facultyOptions = [
  "Engineering and Technology",
  "Informatics and Computing", 
  "Management Studies"
];

const departmentSchema = z.object({
  universityId: z.string().min(1, "University ID is required").min(3, "University ID must be at least 3 characters"),
  selectedFaculty: z.string().min(1, "Faculty selection is required"),
  facultyDepartments: z.record(z.array(z.string())).refine((data) => {
    const hasData = Object.keys(data).length > 0 && Object.values(data).some(depts => depts.length > 0);
    return hasData;
  }, "At least one department must be added"),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export function DeptForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departmentInput, setDepartmentInput] = useState('');
  const inputRef = useRef(null);

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      universityId: "",
      selectedFaculty: "",
      facultyDepartments: {},
    },
  });

  const selectedFaculty = form.watch("selectedFaculty");
  const watchedData = form.watch("facultyDepartments") || {};
  const currentDepartments = watchedData[selectedFaculty] || [];

  const onSubmit = async (data: DepartmentFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Department data:", data);
      toast.success("Department details saved successfully!");
      form.reset();
      setDepartmentInput('');
    } catch (error) {
      toast.error("Failed to save department details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDepartment = () => {
    const trimmedName = departmentInput.trim();
    if (!trimmedName || !selectedFaculty) return;

    const currentData = form.getValues("facultyDepartments") || {};
    const existingDepartments = currentData[selectedFaculty] || [];
    
    if (!existingDepartments.includes(trimmedName)) {
      const newData = {
        ...currentData,
        [selectedFaculty]: [...existingDepartments, trimmedName]
      };
      form.setValue("facultyDepartments", newData);
      setDepartmentInput('');
    }
  };

  const removeDepartment = (departmentToRemove) => {
    if (!selectedFaculty) return;
    
    const currentData = form.getValues("facultyDepartments") || {};
    const currentDepartments = currentData[selectedFaculty] || [];
    const newDepartments = currentDepartments.filter(dept => dept !== departmentToRemove);
    
    const newData = { ...currentData };
    if (newDepartments.length === 0) {
      delete newData[selectedFaculty];
    } else {
      newData[selectedFaculty] = newDepartments;
    }
    
    form.setValue("facultyDepartments", newData);
  };

  const clearAllDepartments = () => {
    if (!selectedFaculty) return;
    
    const currentData = form.getValues("facultyDepartments") || {};
    const newData = { ...currentData };
    delete newData[selectedFaculty];
    form.setValue("facultyDepartments", newData);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDepartment();
    }
  };

  const getTotalDepartments = () => {
    return Object.values(watchedData).reduce((sum, depts) => sum + depts.length, 0);
  };

  return (
    <>
      <FormHeader onSignIn={() => {}} onSignUp={() => {}} />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Department Registration
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Add department details to the university system
            </p>
          </div>

          <Card className="shadow-[var(--form-shadow)] border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                <Building2 className="h-6 w-6" />
                Department Information
              </CardTitle>
              <CardDescription>
                Select a faculty and add its departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="universityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            University ID
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
                              placeholder="Enter university ID (e.g., UNI001)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="selectedFaculty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Select Faculty
                          </FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a faculty to add departments" />
                              </SelectTrigger>
                              <SelectContent>
                                {facultyOptions.map((faculty, index) => (
                                  <SelectItem key={index} value={faculty}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{faculty}</span>
                                      <span className="text-xs text-muted-foreground ml-2">
                                        ({(watchedData[faculty] || []).length} departments)
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Department Management Section */}
                  {selectedFaculty && (
                    <div className="space-y-6">
                      <div className="border rounded-lg p-6 bg-muted/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            {selectedFaculty}
                          </h3>
                          {currentDepartments.length > 0 && (
                            <button
                              type="button"
                              onClick={clearAllDepartments}
                              className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              Clear All
                            </button>
                          )}
                        </div>

                        {/* Add Department Input */}
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <input
                                ref={inputRef}
                                type="text"
                                value={departmentInput}
                                onChange={(e) => setDepartmentInput(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Enter department name and press Enter or click Add..."
                                className="w-full pl-10 pr-4 py-3 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={addDepartment}
                              disabled={!departmentInput.trim()}
                              className="px-6 py-3 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Department
                            </button>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Type a department name and press Enter or click "Add Department".
                          </div>
                        </div>

                        {/* Departments Display */}
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-medium text-foreground">
                              Departments ({currentDepartments.length})
                            </div>
                          </div>
                          
                          {currentDepartments.length === 0 ? (
                            <div className="text-sm text-muted-foreground italic text-center py-8 border-2 border-dashed border-muted rounded-md">
                              No departments added yet for {selectedFaculty}
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {currentDepartments.map((dept, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-background rounded-md border hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                      {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-sm font-medium">{dept}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeDepartment(dept)}
                                    className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition-colors"
                                    title="Remove department"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="facultyDepartments"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Summary Table - All Faculties and Departments */}
                  {getTotalDepartments() > 0 && (
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden bg-background">
                        <div className="bg-muted/50 px-4 py-3 border-b">
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Faculty and Departments Overview
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Complete list of all added faculties and their departments
                          </p>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/30">
                              <tr>
                                <th className="text-left p-4 font-medium text-sm border-r">
                                  Faculty Name
                                </th>
                                <th className="text-left p-4 font-medium text-sm border-r">
                                  Department Count
                                </th>
                                <th className="text-left p-4 font-medium text-sm">
                                  Departments
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {Object.entries(watchedData).map(([faculty, departments], index) => (
                                <tr key={index} className="hover:bg-muted/20 transition-colors">
                                  <td className="p-4 border-r font-medium text-sm">
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-primary" />
                                      {faculty}
                                    </div>
                                  </td>
                                  <td className="p-4 border-r text-center">
                                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                      {departments.length}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex flex-wrap gap-2">
                                      {departments.map((dept, deptIndex) => (
                                        <span
                                          key={deptIndex}
                                          className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                                        >
                                          <span className="text-xs text-muted-foreground mr-1">
                                            {deptIndex + 1}.
                                          </span>
                                          {dept}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="bg-muted/30 px-4 py-3 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-muted-foreground">
                              Total Faculties: {Object.keys(watchedData).length}
                            </div>
                            <div className="text-muted-foreground">
                              Total Departments: {getTotalDepartments()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {getTotalDepartments() > 0 && (
                    <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded text-center">
                      📊 Total departments added: {getTotalDepartments()} across all faculties
                    </div>
                  )}

                  <div className="flex justify-center pt-6">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-8 py-2 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? "Saving..." : "Save Department Details"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}