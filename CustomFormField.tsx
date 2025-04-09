'use client'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { FormFieldTypes } from "./forms/Patientform"
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker";
import { Select } from "@radix-ui/react-select"
import { SelectContent, SelectTrigger, SelectValue } from "./select"
import { Textarea } from "./textarea"
import { Checkbox } from "./checkbox"
import { FileDiff } from "lucide-react"



interface CustomProps {
    control: Control<any>,
    fieldtype: FormFieldTypes,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateformat?: string,
    showtimeselect?: boolean,
    children?: React.ReactNode,
    renderskeleton?: (field: any) => React.ReactNode,
}

const Renderfield = ({ field, props }: { field: any; props: CustomProps }) => {
    const { fieldtype, iconSrc, iconAlt, placeholder, renderskeleton, showtimeselect, dateformat } = props;
    switch (fieldtype) {
        case FormFieldTypes.input:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            height={24}
                            width={24}
                            alt={iconAlt || 'icon'}
                            className="ml-2"
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className="shad-input border-0"
                        />
                    </FormControl>
                </div>
            )
        case FormFieldTypes.textarea:
            return(
                <FormControl>
                    <Textarea 
                        placeholder={placeholder}
                        {...field}
                        className="shad-textArea"
                        disabled={props.disabled}
                    />
                </FormControl>
            )
        case FormFieldTypes.checkbox:
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox
                            id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <label htmlFor={props.name}
                        className="checkbox-label">
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            )
        case FormFieldTypes.phone_input:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry="KE"
                        placeholder={placeholder}
                        international
                        withCountryCallingCode
                        value={field.value}
                        onChange={field.onChange}
                        className="input-phone"
                    />
                </FormControl>
            )    
        case FormFieldTypes.datepicker:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt="calendar"
                        className="ml-2"
                    />
                    <FormControl>
                        <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateformat ?? 'dd/MM/yyyy'}
                            showTimeSelect={showtimeselect ?? false}
                            timeInputLabel="Time:"
                            wrapperClassName="date-picker"
                        />
                    </FormControl>
                </div>
            )
        case FormFieldTypes.select:
            return(
                <FormControl>
                    <Select onValueChange={field.onChange}
                        defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="shad-select-trigger">
                                     <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="shad-select-content">
                                {props.children}
                            </SelectContent>
                        </Select>
                </FormControl>
            )
        case FormFieldTypes.skeleton:
            return (renderskeleton ? renderskeleton(field) : null)
        default:
            return (
                <FormControl>
                    <Input
                        placeholder={placeholder}
                        {...field}
                        className="shad-input border-0"
                    />
                </FormControl>
            )
    }
}

const CustomFormField = (props: CustomProps) => {
    const { control, fieldtype, name, label } = props;
    
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    {fieldtype !== FormFieldTypes.checkbox && label && (
                        <FormLabel>{label}</FormLabel>
                    )}
                    <Renderfield field={field} props={props} />
                    <FormMessage className="shad-error" />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField;