"use client"
 
import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField } from "@/components/ui/form"
import CustomFormField from "@/components/ui/CustomFormField"
import SubmitButton from "../SubmitButton"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions" 
import { FormFieldTypes } from "@/components/ui/forms/Patientform"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { SelectItem } from "@/components/ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"
 
const RegisterForm = ({ user }: { user: any }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [identificationFiles, setIdentificationFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
      // Add other fields from UserFormValidation here
    },
  });
 
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

    if (values.identificationDocument && values.identificationDocument.length > 0) {
       const blobFile = new Blob([values.identificationDocument[0]], 
        { type: values.identificationDocument[0].type,
        })

        formData= new FormData();
        formData.append('blobFile', blobFile);
        formData.append('fileName', values.identificationDocument[0].name);
      }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }

      const patient = await registerPatient(patientData);
    
      if(patient) {
        // Add a small delay before navigation
        setTimeout(() => {
          router.push(`/patients/${user.$id}/new-appointment`);
        }, 500);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know about yourself</p>
        </section>

        <section className="space-y-6">
            <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Personal Information</h2>
        </section>
        <CustomFormField 
          fieldtype={FormFieldTypes.input}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="User"
        />
       <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField 
             fieldtype={FormFieldTypes.input}
             control={form.control}
             name="email"
             label="Email"
             placeholder="petermacharia@gmail.com"
             iconSrc="/assets/icons/email.svg"
             iconAlt="email"
           />
           <CustomFormField 
             fieldtype={FormFieldTypes.phone_input}
             control={form.control}
             name="phone"
             label="Phone Number"
             placeholder="0712345678"
           />
       </div>
       <div className="flex flex-col gap-6 xl:flex-row">
         <CustomFormField 
             fieldtype={FormFieldTypes.datepicker}
             control={form.control}
             name="birthDate"
             label="Date of Birth"
         />
         <CustomFormField 
             fieldtype={FormFieldTypes.skeleton}
             control={form.control}
             name="gender"
             label="Gender"
             renderskeleton={(field: any) => (
                <FormControl>  
                    <RadioGroup 
                      className="flex h-11 gap-6 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                     {GenderOptions.map((option) => (
                        <div key={option} className="radio-group">
                            <RadioGroupItem value={option} id={option} />
                            <label htmlFor={option} className="cursor-pointer">
                              {option}
                            </label>
                        </div>
                     ))}
                    </RadioGroup>
                </FormControl>    
             )}
         />
       </div>
      
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
             fieldtype={FormFieldTypes.input}
             control={form.control}
             name="address"
             label="Address"
             placeholder="Karen, Nairobi"
           />  
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
             <CustomFormField 
             fieldtype={FormFieldTypes.input}
             control={form.control}
             name="occupation"
             label="Occupation"
             placeholder="Software Developer"
           />  
           </div>
           <div className="flex flex-col gap-6 xl:flex-row">
           <CustomFormField 
             fieldtype={FormFieldTypes.input}
             control={form.control}
             name="emergencyContactName"
             label="Emergency contact name"
             placeholder="Guardian's name"
           />
           <CustomFormField 
             fieldtype={FormFieldTypes.phone_input}
             control={form.control}
             name="emergencyContactNumber"
             label="Emergency contact number"
             placeholder="0712345678"
           />
           </div>

           <section className="space-y-6">
            <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Medical Information</h2>
        </section>

        <CustomFormField 
             fieldtype={FormFieldTypes.select}
             control={form.control}
             name="primaryPhysician"
             label="Primary Physician"
             placeholder="Select a physician"
             >
             {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt={doctor.name}
                    className="rounded-full border border-gray-50"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
             ))}
          </CustomFormField>
          <div className="flex flex-col gap-6 xl:flex-row">  
          <CustomFormField 
             fieldtype={FormFieldTypes.input}
             control={form.control}
             name="insuranceProvider"
             label="Insurance provider"
             placeholder="Cytonn Health"
           />  
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
             <CustomFormField 
             fieldtype={FormFieldTypes.input}
             control={form.control}
             name="insurancePolicyNumber"
             label="Insurance policy number"
             placeholder="ABC123456789"
           />  
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">  
          <CustomFormField 
             fieldtype={FormFieldTypes.textarea}
             control={form.control}
             name="allergies"
             label="Allergies (if any)"
             placeholder="Pollen, Peanuts"
           />  
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
             <CustomFormField 
             fieldtype={FormFieldTypes.textarea}
             control={form.control}
             name="currentMedication"
             label="Current medication (if any)"
             placeholder="Ibruprofen 200mg, aspirin 500mg"
           />  
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">  
          <CustomFormField 
             fieldtype={FormFieldTypes.textarea}
             control={form.control}
             name="familyMedicalHistory"
             label="Family medical history"
             placeholder="Mother had diabetes, father had hypertension"
           />  
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
             <CustomFormField 
             fieldtype={FormFieldTypes.textarea}
             control={form.control}
             name="pastMedicalHistory"
             label="Past medical history"
             placeholder="Appendicus appendicitis, appendectomy"
           />  
        </div>

        <section className="space-y-6">
            <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Identification and Verification</h2>
        </section>

        <CustomFormField 
             fieldtype={FormFieldTypes.select}
             control={form.control}
             name="identificationType"
             label="Identification type"
             placeholder="Select an identification type"
             >
             {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
             ))}
          </CustomFormField>

          <CustomFormField 
             fieldtype={FormFieldTypes.input}
             control={form.control}
             name="identificationNumber"
             label="Identification number"
             placeholder="123456789"
           />  

        <CustomFormField 
             fieldtype={FormFieldTypes.skeleton}
             control={form.control}
             name="identificationDocument"
             label="Scanned copy of identification document"
             renderskeleton={() => (
                <FormControl>
                  <FileUploader 
                    files={identificationFiles}
                    onChange={(files) => setIdentificationFiles(files)} 
                  />
                </FormControl>
             )}
           />

              <section className="space-y-6">
               <div className="mb-9 space-y-1"></div>
              <h2 className="sub-header">Consent and Privacy</h2>
               </section>

               <CustomFormField
              fieldtype={FormFieldTypes.checkbox}
              control={form.control}
              name="treatmentConsent"
              label="I consent to receive treatment"
              />
              <CustomFormField
              fieldtype={FormFieldTypes.checkbox}
              control={form.control}
              name="disclosureConsent"
              label="I consent to disclosure of information"
              />
              <CustomFormField
              fieldtype={FormFieldTypes.checkbox}
              control={form.control}
              name="privacyConsent"
              label="I consent to privacy policy"
              />

       <SubmitButton isloading={isLoading}>Get Started</SubmitButton> 
      </form>
    </Form>
  )
}

export default RegisterForm;