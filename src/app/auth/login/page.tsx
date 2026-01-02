import LoginForm from "@/components/form/auth/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center bg-white">
      <div className="flex-grow">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
