import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { GraduationCap, MapPin, Phone, Mail, Globe, Users, Calendar, Award, ChevronLeft, ChevronRight } from "lucide-react";
import FormHeader from "./FormHeader";

const universitySchema = z.object({
  name: z.string().min(1, "Please select a university"),
  uniSecret: z.string().min(1, "Please enter the secret"),
  type: z.enum(["public", "private", "community"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Please enter a valid email address"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  studentCount: z.string().refine((val) => parseInt(val) > 0, "Student count must be a positive number"),
  facultyCount: z.string().refine((val) => parseInt(val) > 0, "Faculty count must be a positive number"),
  officialEmail: z.string().email("Please enter a valid email address"),
  officePhone: z.number().min(10, 'Office Phone Number is mandatory'),
  highAuthorityName : z.string().min(2, 'Higher Authority Name must be atleast two characters')
});

type UniversityFormData = z.infer<typeof universitySchema>;

const universityOptions = [
  "JC Bose University of Science and Technolgy",
  "DCRUST",
  "Manav Rachna",
  "NIT Kurukshetra"
];

const programOptions = [
  "Engineering", "Medicine", "Law", "Business", "Arts & Sciences", "Education",
  "Computer Science", "Nursing", "Psychology", "Biology", "Chemistry", "Physics",
  "Mathematics", "English", "History", "Philosophy", "Economics", "Political Science"
];

const accreditationOptions = [
  "AACSB", "ABET", "LCME", "ABA", "NCATE", "CAHME", "ACPE", "NAACLS"
];

export function UniversityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = [
    { number: 1, title: "Basic Information", description: "University name, type, and basic details" },
    { number: 2, title: "Address Information", description: "Location and address details" },
    { number: 3, title: "Contact Information", description: "Phone, email, and website" },
    { number: 4, title: "University Information", description: "Vice Chancellor, Official Email and other details" },
     { number: 5, title: "University Information", description: "Registrar, Official Email and other details" }
  ];

  const totalSteps = steps.length;

  const form = useForm<UniversityFormData>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      name: "",
      uniSecret: "",
      type: "public",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: "",
      email: "",
      website: "",
      studentCount: "",
      facultyCount: "",
      officialEmail: "",
      highAuthorityName: "",
      officePhone: null
    },
  });

  const onSubmit = async (data: UniversityFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("University data:", data);
      toast.success("University details saved successfully!");
      form.reset();
      setCurrentStep(1);
      
      // Redirect to faculty form
      window.location.href = "/faculty-form";
    } catch (error) {
      toast.error("Failed to save university details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter University Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your University " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uniSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Enter University Secret
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Secret" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Faridabad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Haryana" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="198273" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
              <Phone className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+91 5551234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admissions@university.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.university.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
            </div>
          </div>
        );

      case 4:
        return (
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="highAuthorityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Vice Chancellor Name
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter University VC Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Enter Office Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+91 5551234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="officialEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Enter Official Email Id
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              

            </div>
          </div>
        );

        
      case 5:
        return (
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="highAuthorityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Registrar Name
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter University Registrar Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Enter Office Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+91 5551234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="officialEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Enter Official Email Id
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              

            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <>
    <FormHeader onSignIn={() => {}} onSignUp={() => {}} />
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              University Registration
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Step {currentStep} of {totalSteps}: {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors ${
                  currentStep >= step.number 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {step.number}
                </div>
                {step.number < totalSteps && (
                  <div className={`flex-1 h-1 mx-4 transition-colors ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.number} className="text-xs text-center" style={{ width: '120px' }}>
                <p className={`font-medium ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-[var(--form-shadow)] border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-primary">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {renderStepContent()}

                <div className="flex justify-between pt-6">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button 
                      type="button"
                      onClick={nextStep}
                      className="px-6 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-8 py-2 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? "Saving..." : "Save University Details"}
                    </Button>
                  )}
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