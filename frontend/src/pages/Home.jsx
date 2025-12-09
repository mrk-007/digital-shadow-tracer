// frontend/src/pages/Home.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(6,'Min 6 chars').required('Required'),
});

export default function Home(){
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      // Verify email with backend
      const ve = await API.post('/verify-email', { email: data.email });
      if (!ve.data.exists) {
        // allow proceed, but warn user
        alert('Email MX records not found. We will proceed but email might be invalid/unreachable.');
      }

      // Scan password
      const scan = await API.post('/scan-password', { email: data.email, password: data.password });

      // send results to result page via state
      navigate('/result', { state: { email: data.email, ...scan.data }});
    } catch (err) {
      console.error(err);
      alert('Error while scanning. See console for details.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 flex justify-center items-center min-h-[70vh]">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y:0, opacity:1 }} className="w-full max-w-xl bg-white/6 backdrop-blur-lg rounded-2xl p-8 border border-white/6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">ShadowPass Guardian</h2>
        <p className="mb-6 opacity-80">Check email existence and test password against breach data (HIBP k-anonymity).</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input {...register('email')} className="w-full p-3 rounded bg-white/5" />
            <p className="text-xs text-rose-400">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input {...register('password')} type="password" className="w-full p-3 rounded bg-white/5" />
            <p className="text-xs text-rose-400">{errors.password?.message}</p>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="px-6 py-2 rounded bg-gradient-to-r from-cyan-400 to-indigo-500">Scan Now</button>
            {processing && <Loader />}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
