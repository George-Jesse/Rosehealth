"use client"
 
import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/ui/CustomFormField"
import SubmitButton from "../SubmitButton"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions" 


export enum FormFieldTypes {
  input = "input",
  textarea = "textarea",
  phone_input = "phone_input",
  checkbox = "checkbox",
  datepicker = "datepicker",
  select = "select",
  skeleton = "skeleton",
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" })
})
 
const PatientForm = () => {
  const router = useRouter();
  const [isloading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  });
 
  async function onSubmit({name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const userData = { name, email, phone };

      const user = await createUser(userData);

      
      if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment</p>
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
        <SubmitButton isloading={isloading} > Get Started </SubmitButton> 
      </form>
    </Form>
  )
}

export default PatientForm;