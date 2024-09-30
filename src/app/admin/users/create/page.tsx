'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { z } from 'zod';

const CreateUserPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [cpf, setCPF] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const userSchema = z.object({
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    name: z.string().min(1, 'Nome é obrigatório'),
    cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
    phone: z.string().min(10, 'Telefone inválido'),
    date: z.string().nonempty('Data de nascimento é obrigatória'),
  });

  const formatCPF = (cpf: string) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (phone: string) => {
    return phone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1)$2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleCPFChange = (value: string) => {
    setCPF(formatCPF(value));
  };

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value));
  };

  const cleanCPF = (cpf: string) => {
    return cpf.replace(/\D/g, ''); // Remove pontos e traços antes de enviar
  };

  const cleanPhone = (phone: string) => {
    return phone.replace(/\D/g, ''); // Remove parênteses e traços antes de enviar
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userData = {
      email,
      password,
      name,
      cpf: cleanCPF(cpf), // CPF sem máscara
      phone: cleanPhone(phone), // Telefone sem máscara
      date,
    };

    const validation = userSchema.safeParse(userData);

    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message).join(', ');
      setError(errors);
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/usuario`,
        {
          login: email,
          senha: password,
          pessoa: {
            cpf: cleanCPF(cpf),
            nome: name,
            email: email,
            dataNascimento: date,
            telefone: cleanPhone(phone),
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setLoading(false);

      if (result.status === 409 || result.status === 500) {
        setError('Erro: Este login ou email já está em uso.');
      } else {
        router.push('/admin/');
      }
    } catch (err) {
      console.error('Erro ao tentar registrar o usuário:', err);
      setError('Erro ao tentar registrar o usuário. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center">Cadastro</h2>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
              CPF
            </label>
            <input
              maxLength={14}
              type="text"
              id="cpf"
              value={cpf}
              onChange={(e) => handleCPFChange(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              maxLength={15}
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Data de Nascimento
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 w-full mr-2"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 w-full"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
