import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  Clock,
  Award,
  Plus,
  X
} from "lucide-react";
import FormHeader from "./FormHeader";

// Demo data
const facultyOptions = [
  "Engineering and Technology",
  "Informatics and Computing",
  "Management Studies"
];

const departmentsByFaculty = {
  "Engineering and Technology": [
    "Computer Science",
    "Civil Engineering",
    "Mechanical Engineering"
  ],
  "Informatics and Computing": ["Information Technology", "Computer Applications"],
  "Management Studies": ["Business Administration", "Human Resource Management"]
};

const durationOptions = [
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years",
  "6 Months",
  "1.5 Years"
];

const programTypeOptions = [
  { value: "UG", label: "Undergraduate (UG)" },
  { value: "PG", label: "Postgraduate (PG)" },
  { value: "PHD", label: "Doctor of Philosophy (PHD)" },
  { value: "Diploma", label: "Diploma" },
  { value: "Certificates", label: "Certificates" },
  { value: "Other", label: "Other" }
];

const programSchema = z.object({
  universityId: z.string().min(1, "University ID is required").min(3),
  selectedFaculty: z.string().min(1, "Faculty selection is required"),
  selectedDepartment: z.string().min(1, "Department selection is required"),
  duration: z.string().min(1, "Duration is required"),
  programType: z.enum(
    ["UG", "PG", "PHD", "Diploma", "Certificates", "Other"],
    { required_error: "Please select a program type" }
  ),
  customProgramType: z.string().optional(),
  programs: z
    .record(
      z.record(
        z.array(
          z.object({
            name: z.string(),
            duration: z.string(),
            type: z.string()
          })
        )
      )
    )
    .refine(
      (data) => {
        const hasPrograms =
          Object.keys(data).length > 0 &&
          Object.values(data).some((faculty) =>
            Object.values(faculty).some((dept) => dept.length > 0)
          );
        return hasPrograms;
      },
      "At least one program must be added"
    )
});

type ProgramFormData = z.infer<typeof programSchema>;

export function ProgramForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programInput, setProgramInput] = useState("");
  const [showCustomProgramType, setShowCustomProgramType] = useState(false);
  const inputRef = useRef(null);

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      universityId: "",
      selectedFaculty: "",
      selectedDepartment: "",
      duration: "",
      programType: undefined,
      customProgramType: "",
      programs: {}
    }
  });

  const selectedFaculty = form.watch("selectedFaculty");
  const selectedDepartment = form.watch("selectedDepartment");
  const selectedDuration = form.watch("duration");
  const selectedProgramType = form.watch("programType");
  const watchedPrograms = form.watch("programs") || {};

  const availableDepartments = selectedFaculty
    ? departmentsByFaculty[selectedFaculty] || []
    : [];

  const onSubmit = async (data: ProgramFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Program data:", data);
      toast.success("Program details saved successfully!");
      form.reset();
      setProgramInput("");
      setShowCustomProgramType(false);
    } catch {
      toast.error("Failed to save program details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProgram = () => {
    const trimmedName = programInput.trim();
    if (
      !trimmedName ||
      !selectedFaculty ||
      !selectedDepartment ||
      !selectedDuration ||
      !selectedProgramType
    )
      return;

    const finalType =
      selectedProgramType === "Other"
        ? form.getValues("customProgramType")
        : selectedProgramType;
    if (selectedProgramType === "Other" && !finalType?.trim()) return;

    const currentPrograms = form.getValues("programs") || {};
    const facultyPrograms = currentPrograms[selectedFaculty] || {};
    const departmentPrograms = facultyPrograms[selectedDepartment] || [];

    const programExists = departmentPrograms.some(
      (prog) => prog.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!programExists) {
      const newProgram = {
        name: trimmedName,
        duration: selectedDuration,
        type: finalType as string
      };

      const newPrograms = {
        ...currentPrograms,
        [selectedFaculty]: {
          ...facultyPrograms,
          [selectedDepartment]: [...departmentPrograms, newProgram]
        }
      };

      form.setValue("programs", newPrograms);
      setProgramInput("");
    }
  };

  const removeProgram = (faculty: string, department: string, programIndex: number) => {
    const currentPrograms = form.getValues("programs") || {};
    const facultyPrograms = currentPrograms[faculty] || {};
    const departmentPrograms = facultyPrograms[department] || [];

    const newDepartmentPrograms = departmentPrograms.filter(
      (_, index) => index !== programIndex
    );

    const newPrograms = { ...currentPrograms };
    if (newDepartmentPrograms.length === 0) {
      delete newPrograms[faculty][department];
      if (Object.keys(newPrograms[faculty]).length === 0) {
        delete newPrograms[faculty];
      }
    } else {
      newPrograms[faculty] = {
        ...newPrograms[faculty],
        [department]: newDepartmentPrograms
      };
    }

    form.setValue("programs", newPrograms);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addProgram();
    }
  };

  const getTotalPrograms = () =>
    Object.values(watchedPrograms).reduce(
      (total, faculty) =>
        total +
        Object.values(faculty).reduce(
          (facultyTotal, dept) => facultyTotal + dept.length,
          0
        ),
      0
    );

  const getCurrentDepartmentPrograms = () => {
    if (!selectedFaculty || !selectedDepartment) return [];
    return watchedPrograms[selectedFaculty]?.[selectedDepartment] || [];
  };

  return (
    <>
      <FormHeader onSignIn={() => {}} onSignUp={() => {}} />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Program Registration
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Add program details to the university system
            </p>
          </div>

          <Card className="shadow-[var(--form-shadow)] border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                <BookOpen className="h-6 w-6" />
                Program Information
              </CardTitle>
              <CardDescription>
                Select faculty, department, and add programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                form.setValue("selectedDepartment", "");
                              }}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a faculty" />
                              </SelectTrigger>
                              <SelectContent>
                                {facultyOptions.map((faculty, index) => (
                                  <SelectItem key={index} value={faculty}>
                                    {faculty}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedFaculty && (
                      <FormField
                        control={form.control}
                        name="selectedDepartment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              Select Department
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Choose a department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableDepartments.map((department, index) => (
                                    <SelectItem key={index} value={department}>
                                      {department}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {selectedDepartment && (
                      <>
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Duration
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {durationOptions.map((duration, index) => (
                                      <SelectItem key={index} value={duration}>
                                        {duration}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="programType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Program Type
                              </FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setShowCustomProgramType(value === "Other");
                                  if (value !== "Other") {
                                    form.setValue("customProgramType", "");
                                  }
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select program type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {programTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {showCustomProgramType && (
                          <FormField
                            control={form.control}
                            name="customProgramType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Award className="h-4 w-4" />
                                  Custom Program Type
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter custom program type"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </>
                    )}
                  </div>

                  {selectedDepartment && selectedDuration && selectedProgramType && (
                    <div className="space-y-6">
                      <div className="border rounded-lg p-6 bg-muted/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Programs for {selectedDepartment}
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <input
                                ref={inputRef}
                                type="text"
                                value={programInput}
                                onChange={(e) => setProgramInput(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Enter program name and press Enter or click Add..."
                                className="w-full pl-10 pr-4 py-3 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={addProgram}
                              disabled={!programInput.trim()}
                              className="px-6 py-3 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add Program
                            </button>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Duration: <strong>{selectedDuration}</strong> | Type:{" "}
                            <strong>
                              {selectedProgramType === "Other"
                                ? form.getValues("customProgramType") || "Not specified"
                                : programTypeOptions.find(
                                    (opt) => opt.value === selectedProgramType
                                  )?.label}
                            </strong>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="text-sm font-medium text-foreground mb-3">
                            Programs ({getCurrentDepartmentPrograms().length})
                          </div>

                          {getCurrentDepartmentPrograms().length === 0 ? (
                            <div className="text-sm text-muted-foreground italic text-center py-8 border-2 border-dashed border-muted rounded-md">
                              No programs added yet for {selectedDepartment}
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {getCurrentDepartmentPrograms().map((program, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-background rounded-md border hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                                      {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                      <div className="text-sm font-medium">{program.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {program.duration} • {program.type}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeProgram(selectedFaculty, selectedDepartment, index)
                                    }
                                    className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition-colors"
                                    title="Remove program"
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

                  {getTotalPrograms() > 0 && (
                    <div className="space-y-4">
                      <div className="border rounded-lg overflow-hidden bg-background">
                        <div className="bg-muted/50 px-4 py-3 border-b">
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            All Programs Overview
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Complete list of all added programs by faculty and department
                          </p>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/30">
                              <tr>
                                <th className="text-left p-4 font-medium text-sm border-r">
                                  Faculty
                                </th>
                                <th className="text-left p-4 font-medium text-sm border-r">
                                  Department
                                </th>
                                <th className="text-left p-4 font-medium text-sm border-r">
                                  Program
                                </th>
                                <th className="text-left p-4 font-medium text-sm border-r">
                                  Duration
                                </th>
                                <th className="text-left p-4 font-medium text-sm">
                                  Type
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(watchedPrograms).map(
                                ([faculty, departments]) =>
                                  Object.entries(departments).map(
                                    ([department, programs]) =>
                                      programs.map((program, index) => (
                                        <tr
                                          key={`${faculty}-${department}-${index}`}
                                          className="border-b hover:bg-muted/20 transition-colors"
                                        >
                                          <td className="p-4 text-sm border-r">{faculty}</td>
                                          <td className="p-4 text-sm border-r">{department}</td>
                                          <td className="p-4 text-sm border-r">{program.name}</td>
                                          <td className="p-4 text-sm border-r">
                                            {program.duration}
                                          </td>
                                          <td className="p-4 text-sm">{program.type}</td>
                                        </tr>
                                      ))
                                  )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="px-8 py-3 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save Program Details"}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
