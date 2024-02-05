import { useState, useEffect, FormEventHandler, SetStateAction } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps, PatientCategory } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'

type PatientCreateProps = {
    code:string;
    patient_categories:PatientCategory[]
}

export default function Create({auth, code, patient_categories}: PageProps & PatientCreateProps) {

    const { data, setData, post, processing, errors, reset } = useForm({
        code,
        name: '',
        bpjs_number: '',
        patient_category_id:0,
        city_place:'',
        birth_date: '',
        address:'',
        phone_number:''
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('administrator.patients.store'));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="data-master"
            routeChild="data-pasien"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Pasien</h2>}
        >
            <Head title="Form Pasien" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.patients')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
                                <InputLabel htmlFor="code" value="Kode Pasien" />

                                <TextInput
                                    id="code"
                                    type="text"
                                    name="code"
                                    value={data.code}
                                    className="mt-1 block w-full"
                                    autoComplete="code"
                                    readOnly
                                />

                                <InputError message={errors.code} className="mt-2" />
                            </div>

                            <div className="mt-4 w-full">
                                <InputLabel htmlFor="patient_category_id" value="Kategori Pasien" />

                                <Select onValueChange={(value) => setData('patient_category_id', parseInt(value))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Kategori Pasien ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {
                                        patient_categories.map((row, key) => (
                                            <SelectItem key={key} value={row.id.toString()}>{row.name}</SelectItem>
                                        ))
                                    }
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.patient_category_id} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="name" value="Nama Pasien" />

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
                                <InputLabel htmlFor="bpjs_number" value="Nomor BPJS" />

                                <TextInput
                                    id="bpjs_number"
                                    type="text"
                                    name="bpjs_number"
                                    value={data.bpjs_number}
                                    className="mt-1 block w-full"
                                    autoComplete="bpjs_number"
                                    onChange={(e) => setData('bpjs_number', e.target.value)}
                                />

                                <InputError message={errors.bpjs_number} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="city_place" value="Kota Pasien" />

                                <TextInput
                                    id="city_place"
                                    type="text"
                                    name="city_place"
                                    value={data.city_place}
                                    className="mt-1 block w-full"
                                    autoComplete="city_place"
                                    onChange={(e) => setData('city_place', e.target.value)}
                                />

                                <InputError message={errors.city_place} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="birth_date" value="Tanggal Lahir" />

                                <TextInput
                                    id="birth_date"
                                    type="date"
                                    name="birth_date"
                                    value={data.birth_date}
                                    className="mt-1 block w-full"
                                    autoComplete="birth_date"
                                    onChange={(e) => setData('birth_date',e.target.value)}
                                />

                                <InputError message={errors.birth_date} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="address" value="Alamat Pasien" />

                                <Textarea 
                                    name="address"
                                    className="mt-1 block w-full focus:border-indigo-700" 
                                    value={data.address}
                                    rows={10}
                                    cols={10}
                                    onChange={(e) => setData('address', e.target.value)}
                                />

                                <InputError message={errors.address} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="phone_number" value="Nomor HP Pasien" />

                                <TextInput
                                    id="phone_number"
                                    type="number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    className="mt-1 block w-full"
                                    autoComplete="phone_number"
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                />

                                <InputError message={errors.phone_number} className="mt-2" />
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