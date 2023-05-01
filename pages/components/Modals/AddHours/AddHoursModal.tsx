'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import Heading from '../../AuxComponents/ModalsGenerator/Heading';

import useAddHoursModal from '@/pages/hooks/useAddHoursModal';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '../../AuxComponents/ModalsGenerator/Modal';
import { toast } from 'react-hot-toast';
import useAddPlaneModal from '@/pages/hooks/useAddPlaneModal';
import { useSession } from 'next-auth/react';

const AddHoursModal = () => {
  const { data } = useSession();
  const userData = data?.user

  const addHoursModal = useAddHoursModal();
  const addPlaneModal = useAddPlaneModal();

  const [isLoading, setIsLoading] = useState(false);

  enum TypeHours {
    'Simulador' = 'Simulador',
    'Escuela' = 'Escuela',
    'Copiloto' = 'Copiloto',
    'Autonomo' = 'Autonomo',
  }
  enum Matriculas {
    'A003' = 'A003',
    'A004' = 'A004',
    'A005' = 'A005',
    'A0006' = 'A0006',
  }
  const schema = yup
    .object({
      folio: yup
        .number()
        .positive('Debe ser positivo')
        .integer('Debe ser entero')
        .required()
        .typeError('Debe ser un número'),
      //userId: yup.string().required(),
      date: yup.string().required('Fecha es un campo obligatorio'),

      aircraftId: yup
        .mixed()
        .oneOf(Object.values(Matriculas), 'Avión no registrado (ej A003)'),
      stages: yup.string().required('Debe ingresar las etapas'),
      remarks: yup.string(),
      flightType: yup
        .mixed()
        .oneOf(Object.values(TypeHours), 'Debe ser un tipo definido'),
      hourCount: yup
        .number()
        .positive('Debe ser positivo')
        .typeError('Debe ser un número. La coma es el punto'),
    })
    .required();
  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const userByRole = async (email: string) => {
    setIsLoading(true);
    return axios
      .get(`/api/getUserByEmail/${email}`)
      .then((result) => {
        return result.data;
      })
      .catch(() => {
        toast.error('Error User Search');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    reset();
    let result = userByRole(userData?.email);
    result.then(async (user) => {
       await axios
         .post(`http://localhost:3000/api/flight`, {...data, userId:user.id})
         .then(() => {
           toast.success('Saved');
           addHoursModal.onClose();
         })
         .catch(() => toast.error('Error Save Data'));
    });
   
  };

  //  const onSubmit: SubmitHandler<FieldValues> = (data) => {
  //setIsLoading(true);
  //console.log('data');
  // axios
  //   .post('/api/register', data)
  //   .then(() => {
  //     toast.success('Registered!');
  //     registerModal.onClose();
  //     loginModal.onOpen();
  //   })
  //   .catch((error) => {
  //     toast.error('Error Login');
  //   })
  //   .finally(() => {
  //     setIsLoading(false);
  //   });
  //};

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading
        title='Add Hours to your log'
        subtitle='Fill in the fields that apply'
      />
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col '>
        {/* <div className='flex flex-col text-center'>
          <div className='flex justify-between'>
            <label>User: </label>
            <input className='border border-black' {...register('userId')} />
          </div>
          <p className='text-red-600'>{errors.userId?.message}</p>
        </div> */}
        <div className='flex flex-col text-center'>
          <div className='flex justify-between'>
            <label>Folio: </label>
            <input className='border border-black' {...register('folio')} />
          </div>
          <p className='text-red-600'>{errors.folio?.message}</p>
        </div>
        <div className='flex flex-col text-center'>
          <div className='flex justify-between'>
            <label>Fecha: </label>
            <input
              type='date'
              className='border border-black'
              {...register('date')}
            />
          </div>
          <p className='text-red-600'>{errors.date?.message}</p>
        </div>
        <div className='flex flex-col text-center'>
          <div className='flex justify-between'>
            <label>Matricula: </label>
            <input
              className='border border-black'
              {...register('aircraftId')}
            />
          </div>
          <p className='text-red-600'>{errors.aircraftId?.message}</p>
        </div>
        <div className='flex flex-col text-center'>
          <div className='flex justify-between'>
            <label>Etapas: </label>
            <input className='border border-black' {...register('stages')} />
          </div>
          <p className='text-red-600'>{errors.stages?.message}</p>
        </div>
        <div className='flex flex-col text-center'>
          <div className='flex justify-between'>
            <label>Observaciones: </label>
            <input className='border border-black' {...register('remarks')} />
          </div>
          <p className='text-red-600'>{errors.remarks?.message}</p>
        </div>
        <div className='flex flex-col text-center'>
          <div className='flex justify-between'>
            <label>Tipo de Horas:</label>
            <select {...register('flightType')}>
              <option value='Simulador'>Simulador</option>
              <option value='Escuela'>Escuela</option>
              <option value='Copiloto'>Copiloto</option>
              <option value='Autónomo'>Autónomo</option>
            </select>
          </div>
          <p className='text-red-600'>{errors.flightType?.message}</p>
        </div>
        <div className='flex flex-col text-center'>
          <div className='flex justify-between'>
            <label>Horas a Cargar: </label>
            <input className='border border-black' {...register('hourCount')} />
          </div>
          <p className='text-red-600'>{errors.hourCount?.message}</p>
        </div>
        <button>SEND</button>
      </form>
      <button onClick={() => addPlaneModal.onOpen()}>avion</button>
    </div>
  );

  const footerContent = (
    <div className='flex flex-col gap-4 mt-3'>
      <hr />
      <div
        className='
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        '
      >
        <p>Footer de Add Hours</p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={addHoursModal.isOpen}
      title='ADD HOURS'
      onClose={addHoursModal.onClose}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default AddHoursModal;
