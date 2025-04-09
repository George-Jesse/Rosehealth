"use client"
 
import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/ui/CustomFormField"
import SubmitButton from "../SubmitButton"
import { CreateAppointmentSchema, getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions" 
import { FormFieldTypes } from "./Patientform"
import { Doctors } from "@/constants"
import { SelectItem } from "../select"
import Image from "next/image"
import { createAppointment } from "@/lib/actions/appointment.actions"

type Status = "pending" | "scheduled" | "cancelled" | "completed" ;


const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" })
})
 
const AppointmentForm = ({
  userId, 
  patientId, 
  type
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
}) => {
const router = useRouter();
const [isloading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });
 
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status: Status;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
        break;
    }
    try {
      if (type === "cancel" && patientId) {
        // Handle cancellation logic here
        // You might need to add your cancellation function
      } else {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status
        };
        
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.id}`);
        }
      }
    } 

         catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  let buttonLabel;
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'create':
      buttonLabel = 'Create Appointment';
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment';
      break;
    default:
      break;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Request a new appointment in 10 seconds</p>
        </section>

        {type !== "cancel" && (
            <>
          <CustomFormField 
             fieldtype={FormFieldTypes.select}
             control={form.control}
             name="primaryPhysician"
             label="Doctor"
             placeholder="Select a doctor"
             >
             {Doctors.map((doctor) => (
              <SelectItem  key={doctor.name} value={doctor.name}>
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

          <CustomFormField
            fieldtype={FormFieldTypes.datepicker}
            control={form.control}
            name="schedule"
            label="Expected appointment date"
            showtimeselect
            dateformat="dd/MM/yyyy - hh:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldtype={FormFieldTypes.textarea}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter the reason for your appointment"
            />
            <CustomFormField
                fieldtype={FormFieldTypes.textarea}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter notes"
              
              />
            </div>          
            </>
        )}

        {type =="cancel" && (
          <CustomFormField
            fieldtype={FormFieldTypes.textarea}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter the reason for cancellation"
          />
        )}
         
         <SubmitButton 
          isloading={isloading} 
          className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
        >
          {buttonLabel}
        </SubmitButton> 
      </form>
    </Form>
  )
}

export default AppointmentForm;