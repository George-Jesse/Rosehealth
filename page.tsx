
import Image from 'next/image'
import RegisterForm from '@/components/ui/forms/RegisterForm'
import Link from 'next/link'
import React from 'react'
import { getUser } from '@/lib/actions/patient.actions'

const register = async({ params : { userid }}: SearchParamProps) => {
    const user = await getUser(userid)
  return (
    <div className="flex h-screen max-h-screen">
          <section className="remove scrollbar container">
            <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
              <Image
                src="/assets/icons/logo-full.svg"
                height={1000}
                width={1000}
                alt="patient"
                className="mb-12 h-10 w-fit"
              />
              <RegisterForm user = {user}/>
                <p className="copyright py-12">
                  © 2024 Rosehealth. All rights reserved.
                  </p>             
            </div>
          </section>
    
          <Image
            src="/assets/images/register-img.png"
            height={1000}
            width={1000}
            alt="patient"
            className="side-image max-w-[390px]"
          />
        </div>
   
  )
}

export default register
