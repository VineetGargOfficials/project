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
import { Users, GraduationCap, IdCard, User, X, Plus } from "lucide-react";
import FormHeader from "./FormHeader";

// No predefined faculty list - users will add their own

const facultySchema = z.object({
  universityId: z.string().min(1, "University ID is required").min(3, "University ID must be at least 3 characters"),
  facultyId: z.string().min(1, "Faculty ID is required").min(3, "Faculty ID must be at least 3 characters"),
  facultyName: z.string().min(2, "Faculty name must be at least 2 characters").max(100, "Faculty name must be less than 100 characters"),
  facultyList: z.array(z.string()).min(1, "At least one faculty member must be selected"),
});

type FacultyFormData = z.infer<typeof facultySchema>;

export function FacultyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      universityId: "",
      facultyName: "",
      facultyList: []
    },
  });

  const onSubmit = async (data: FacultyFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Faculty data:", data);
      toast.success("Faculty details saved successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to save faculty details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FormHeader 
        onSignIn={() => { /* handle sign in */ }} 
        onSignUp={() => { /* handle sign up */ }} 
      />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Faculty Information
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Add faculty details to the university system
            </p>
          </div>

          <Card className="shadow-[var(--form-shadow)] border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                <User className="h-6 w-6" />
                Faculty Information
              </CardTitle>
              <CardDescription>
                Enter the faculty member's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      name="facultyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Faculty Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
                              placeholder="Enter full name of faculty member" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="facultyList"
                      render={({ field }) => {
                        const [inputValue, setInputValue] = useState('');
                        const [selectedTags, setSelectedTags] = useState(field.value || []);
                        const inputRef = useRef(null);

                        const addTag = (tagName) => {
                          const trimmedName = tagName.trim();
                          if (trimmedName && !selectedTags.includes(trimmedName)) {
                            const newTags = [...selectedTags, trimmedName];
                            setSelectedTags(newTags);
                            field.onChange(newTags);
                            setInputValue('');
                          }
                        };

                        const removeTag = (tagToRemove) => {
                          const newTags = selectedTags.filter(tag => tag !== tagToRemove);
                          setSelectedTags(newTags);
                          field.onChange(newTags);
                        };

                        const handleInputKeyDown = (e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(inputValue);
                          } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
                            // Remove last tag if backspace is pressed on empty input
                            removeTag(selectedTags[selectedTags.length - 1]);
                          }
                        };

                        const handleAddClick = () => {
                          addTag(inputValue);
                        };

                        return (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Faculty Name
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                {/* Input and Add Interface */}
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                      ref={inputRef}
                                      type="text"
                                      value={inputValue}
                                      onChange={(e) => setInputValue(e.target.value)}
                                      onKeyDown={handleInputKeyDown}
                                      placeholder="Enter faculty name and press Enter or click Add..."
                                      className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleAddClick}
                                    disabled={!inputValue.trim()}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add
                                  </button>
                                </div>

                                {/* Instructions */}
                                <div className="text-xs text-muted-foreground">
                                  Type a faculty name and press Enter or click Add. Press Backspace to remove the last added faculty.
                                </div>

                                {/* Selected Faculty List Display */}
                                <div className="border rounded-md p-4 bg-background min-h-[80px]">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="text-sm font-medium text-foreground">
                                      Faculty List ({selectedTags.length})
                                    </div>
                                    {selectedTags.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedTags([]);
                                          field.onChange([]);
                                        }}
                                        className="text-xs text-muted-foreground hover:text-destructive"
                                      >
                                        Clear All
                                      </button>
                                    )}
                                  </div>
                                  
                                  {selectedTags.length === 0 ? (
                                    <div className="text-sm text-muted-foreground italic text-center py-4">
                                      No faculty members added yet
                                    </div>
                                  ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                      {selectedTags.map((faculty, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between p-2 bg-muted/50 rounded-md hover:bg-muted/80 transition-colors"
                                        >
                                          <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded">
                                              {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="text-sm font-medium">{faculty}</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => removeTag(faculty)}
                                            className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
                                            title="Remove faculty member"
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Summary */}
                                {selectedTags.length > 0 && (
                                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded text-center">
                                    📋 Total faculty members: {selectedTags.length}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-8 py-2 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? "Saving..." : "Save Faculty Details"}
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