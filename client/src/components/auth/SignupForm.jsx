import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signup, login } from '../../api/auth.js';
import { getCharities } from '../../api/charities.js';
import Input from '../common/Input.jsx';
import PasswordInput from '../common/PasswordInput.jsx';
import Button from '../common/Button.jsx';
import CharitySelector from '../charity/CharitySelector.jsx';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [charities, setCharities] = useState([]);
  const [charityId, setCharityId] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getCharities()
      .then(setCharities)
      .catch(() => setCharities([]));
  }, []);

  const onSubmit = async (values) => {
    if (!charityId) {
      setServerError('Please select a charity.');
      return;
    }

    setServerError('');
    setLoading(true);

    try {
      await signup(
        values.email,
        values.password,
        values.fullName,
        charityId,
      );

      await login(
        values.email,
        values.password,
      );

      navigate('/subscribe');
    } catch (error) {
      setServerError(
        error.response?.data?.error ||
        error.message ||
        'Signup failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-sm"
    >
      <Input
        label="Full name"
        {...register('fullName', {
          required: 'Name is required',
        })}
        error={errors.fullName?.message}
      />

      <Input
        label="Email"
        type="email"
        {...register('email', {
          required: 'Email is required',
        })}
        error={errors.email?.message}
      />

      <PasswordInput
        label="Password"
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message:
              'Password must be at least 6 characters',
          },
        })}
        error={errors.password?.message}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-300">
          Choose your charity
        </label>

        <CharitySelector
          charities={charities}
          value={charityId}
          onChange={setCharityId}
        />
      </div>

      {serverError && (
        <span className="text-sm text-red-400">
          {serverError}
        </span>
      )}

      <Button
        type="submit"
        disabled={loading || !charityId}
      >
        {loading
          ? 'Creating account...'
          : 'Sign up'}
      </Button>
    </form>
  );
}