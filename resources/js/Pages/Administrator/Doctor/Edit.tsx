import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'

import { Doctor, DoctorForm } from './type'

type DoctorProps = {
    doctor:Doctor
}


export default function Edit({auth, doctor}: PageProps & DoctorProps) {

    const { data, setData, post, put, processing, errors, reset } = useForm<DoctorForm>({
        code: doctor.code,
        name: doctor.name,
        username: doctor.username,
        password: '',
        address: doctor.address,
        phone_number: doctor.phone_number,
        fee:doctor.fee,
        status_doctor:doctor.status_doctor
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        put(route('administrator.doctors.update',doctor.id));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="data-master"
            routeChild="data-dokter"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Dokter</h2>}
        >
            <Head title="Form Dokter" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary">
                                <Link href={route('administrator.doctors')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
                                <InputLabel htmlFor="code" value="Kode Dokter" />

                                <TextInput
                                    id="code"
                                    type="text"
                                    name="code"
                                    value={data.code}
                                    className="mt-1 block w-full"
                                    autoComplete="code"
                                    isFocused={true}
                                    onChange={(e) => setData('code', e.target.value)}
                                />

                                <InputError message={errors.code} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="name" value="Nama Dokter" />

                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="username" value="Username" />

                                <TextInput
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('username', e.target.value)}
                                />

                                <InputError message={errors.username} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="address" value="Alamat Dokter" />

                                {/*<TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />*/}

                                <Textarea 
                                    name="address" 
                                    placeholder="Isi Alamat Dokter" 
                                    className="mt-1 block w-full focus:border-indigo-700" 
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />

                                <InputError message={errors.address} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="phone_number" value="Nomor HP Dokter" />

                                <TextInput
                                    id="phone_number"
                                    type="number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    className="mt-1 block w-full"
                                    autoComplete="phone_number"
                                    onChange={(e) => setData('phone_number', parseInt(e.target.value))}
                                />

                                <InputError message={errors.phone_number} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="fee" value="Biaya Dokter" />

                                <TextInput
                                    id="fee"
                                    type="number"
                                    name="fee"
                                    value={data.fee ?? ''}
                                    className="mt-1 block w-full"
                                    autoComplete="fee"
                                    onChange={(e) => setData('fee', parseInt(e.target.value))}
                                />

                                <InputError message={errors.fee} className="mt-2" />
                            </div>

                            <div className="mt-4 w-full">
                                <InputLabel htmlFor="status_doctor" value="Status Dokter" />

                                {/*<TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="password"
                                    onChange={(e) => setData('s', e.target.value)}
                                />*/}

                                <Select defaultValue={doctor.status_doctor.toString()} onValueChange={(value) => setData('status_doctor', parseInt(value))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Status Dokter ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Aktif</SelectItem>
                                    <SelectItem value="0">Tidak Aktif</SelectItem>
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.status_doctor} className="mt-2" />
                            </div>

                            <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                                <Button variant="warning" disabled={processing}>Edit</Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AdministratorLayout>
    )
}