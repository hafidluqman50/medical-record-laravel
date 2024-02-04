import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, Patient, Doctor } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'

interface Registration {
    id: number
    number_register:string
    patient_id:number
    doctor_id:number
    date_register:string
    body_height:number
    body_weight:number
    body_temp:number
    blood_pressure:string
    complains_of_pain:string
    supporting_examinations:string
    status_register:number
}

type FormCreateProps = {
    patients:Patient[]
    doctors:Doctor[]
    registration:Registration
}

export default function Create({auth, patients, doctors, registration}: PageProps & FormCreateProps) {

    const { data, setData, put, processing, errors, reset } = useForm({
        number_register:registration.number_register,
        patient_id:registration.patient_id,
        doctor_id:registration.doctor_id,
        body_height:registration.body_height,
        body_weight:registration.body_weight,
        body_temp:registration.body_temp,
        blood_pressure:registration.blood_pressure,
        complains_of_pain:registration.complains_of_pain,
        supporting_examinations:registration.supporting_examinations
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        put(route('administrator.registrations.update', registration.id));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="data-master"
            routeChild="data-dokter"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Pendaftaran</h2>}
        >
            <Head title="Form Pendaftaran" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.registrations')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
                                <InputLabel htmlFor="number_register" value="Nomor Pendaftaran" />

                                <TextInput
                                    id="number_register"
                                    type="text"
                                    name="number_register"
                                    value={data.number_register}
                                    className="mt-1 block w-full"
                                    autoComplete="number_register"
                                    readOnly
                                    onChange={(e) => setData('number_register', e.target.value)}
                                />

                                <InputError message={errors.number_register} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <InputLabel htmlFor="patient_id" value="Pasien" />

                                <Select defaultValue={registration.patient_id.toString()} onValueChange={(value) => setData('patient_id', parseInt(value))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Pasien ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {
                                    patients.map((row, key) => (
                                        <SelectItem value={row.id.toString()} key={key}>{row.name}</SelectItem>
                                    ))
                                  }
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.patient_id} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="doctor_id" value="Dokter" />

                                <Select defaultValue={registration.doctor_id.toString()}  onValueChange={(value) => setData('doctor_id', parseInt(value))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Dokter ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {
                                    doctors.map((row, key) => (
                                        <SelectItem value={row.id.toString()} key={key}>{row.name}</SelectItem>
                                    ))
                                  }
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.doctor_id} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="body_height" value="Tinggi Badan" />
                                <div className="flex">
                                    <TextInput
                                        id="body_height"
                                        type="number"
                                        name="body_height"
                                        value={data.body_height}
                                        className="mt-1 block w-full"
                                        autoComplete="body_height"
                                        onChange={(e) => setData('body_height', parseFloat(e.target.value))}
                                    />
                                    <Button variant="ghost" className="mt-1" type="button" disabled>Cm</Button>
                                </div>

                                <InputError message={errors.body_height} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="body_weight" value="Berat Badan" />
                                <div className="flex">
                                <TextInput
                                    id="body_weight"
                                    type="number"
                                    name="body_weight"
                                    value={data.body_weight}
                                    className="mt-1 block w-full"
                                    autoComplete="body_weight"
                                    onChange={(e) => setData('body_weight', parseFloat(e.target.value))}
                                />
                                <Button variant="ghost" className="mt-1" type="button" disabled>Kg</Button>
                                </div>

                                <InputError message={errors.body_weight} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="body_temp" value="Suhu Badan" />
                                <div className="flex">
                                <TextInput
                                    id="body_temp"
                                    type="number"
                                    name="body_temp"
                                    value={data.body_temp}
                                    className="mt-1 block w-full"
                                    autoComplete="body_temp"
                                    onChange={(e) => setData('body_temp', parseFloat(e.target.value))}
                                />
                                <Button variant="ghost" className="mt-1" type="button" disabled>&deg;C</Button>
                                </div>

                                <InputError message={errors.body_temp} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="blood_pressure" value="Tekanan Darah" />
                                <div className="flex">
                                <TextInput
                                    id="blood_pressure"
                                    type="text"
                                    name="blood_pressure"
                                    value={data.blood_pressure}
                                    className="mt-1 block w-full"
                                    autoComplete="blood_pressure"
                                    onChange={(e) => setData('blood_pressure', e.target.value)}
                                />
                                <Button variant="ghost" className="mt-1" type="button" disabled>mmHg</Button>
                                </div>

                                <InputError message={errors.blood_pressure} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="complains_of_pain" value="Keluhan Penyakit" />

                                <Textarea 
                                    name="complains_of_pain"  
                                    className="mt-1 block w-full focus:border-indigo-700" 
                                    value={data.complains_of_pain}
                                    rows={10}
                                    cols={30}
                                    onChange={(e) => setData('complains_of_pain', e.target.value)}
                                />

                                <InputError message={errors.complains_of_pain} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="supporting_examinations" value="Pemeriksaan Penunjang" />

                                <TextInput
                                    id="supporting_examinations"
                                    type="text"
                                    name="supporting_examinations"
                                    value={data.supporting_examinations}
                                    className="mt-1 block w-full"
                                    autoComplete="supporting_examinations"
                                    onChange={(e) => setData('supporting_examinations', e.target.value)}
                                />

                                <InputError message={errors.supporting_examinations} className="mt-2" />
                            </div>

                            <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                                <Button disabled={processing}>Simpan</Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AdministratorLayout>
    )
}