import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../../api/auth.js';
import Input from '../common/Input.jsx';
import PasswordInput from '../common/PasswordInput.jsx';
import Button from '../common/Button.jsx';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setServerError('');
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
      <Input
        label="Email"
        type="email"
        {...register('email', { required: 'Email is required' })}
        error={errors.email?.message}
      />
      <PasswordInput
        label="Password"
        {...register('password', { required: 'Password is required' })}
        error={errors.password?.message}
      />
      {serverError && <span className="text-sm text-red-400">{serverError}</span>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in'}
      </Button>
      <p className="text-sm text-gray-400 text-center">
        Don't have an account?{' '}
        <Link to="/signup" className="text-emerald-400 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}