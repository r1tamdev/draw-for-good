import LoginForm from '../../components/auth/LoginForm.jsx';

export default function Login() {
  return (
    <div className="px-6 py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Log in</h1>
      <LoginForm />
    </div>
  );
}