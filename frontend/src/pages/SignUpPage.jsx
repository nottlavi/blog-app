import React from 'react'
import { FormTemplate } from '../components/core/LoginPage/FormTemplate'

export const SignUpPage = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="page-title">Create your account</h1>
      <FormTemplate type="signup" />
    </div>
  )
}
