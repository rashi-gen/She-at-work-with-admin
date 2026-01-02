import RegisterForm from "@/components/form/auth/RegisterForm";
import React from "react";

function RegisterPage() {
  return (
    <div className=" flex items-center min-h-screen">
      <div className="flex-grow">
        <RegisterForm text="Register to get started" role={"USER"} />
      </div>
    </div>
  );
}

export default RegisterPage;
