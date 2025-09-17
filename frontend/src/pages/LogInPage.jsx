import React from "react";
import { FormTemplate } from "../components/core/LoginPage/FormTemplate";

export const LogInPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="page-title">Welcome back</h1>
      <FormTemplate type="login"/>
    </div>
  );
};
