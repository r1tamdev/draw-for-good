import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signup, login } from '../../api/auth.js';
import Input from '../common/Input.jsx';
import PasswordInput from '../common/PasswordInput.jsx';
import Button from '../common/Button.jsx';

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setServerError('');
    setLoading(true);
    try {
      await signup(values.email, values.password, values.fullName);
      await login(values.email, values.password);
      navigate('/subscribe');
    } catch (err) {
      setServerError(err.response?.data?.error || err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
      <Input
        label="Full name"
        {...register('fullName', { required: 'Name is required' })}
        error={errors.fullName?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email', { required: 'Email is required' })}
        error={errors.email?.message}
      />
      <PasswordInput
        label="Password"
        {...register('password', { required: 'Password is required', minLength: 6 })}
        error={errors.password?.message}
      />
      {serverError && <span className="text-sm text-red-400">{serverError}</span>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  );
}