import SignupForm from '../../components/auth/SignupForm.jsx';

export default function Signup() {
  return (
    <div className="px-6 py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Create your account</h1>
      <SignupForm />
    </div>
  );
}