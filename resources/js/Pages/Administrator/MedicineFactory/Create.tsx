import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
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

interface MedicineFactoryForm {
    name:string
    phone_number:string
    address:string
}

export default function Create({auth}: PageProps) {

    const { data, setData, post, processing, errors, reset } = useForm<MedicineFactoryForm>({
        name: '',
        phone_number:'',
        address:''
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('administrator.medicine-factories.store'));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="data-obat"
            routeChild="data-golongan-obat"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Pabrik Obat</h2>}
        >
            <Head title="Form Pabrik Obat" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.medicine-factories')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
                                <InputLabel htmlFor="name" value="Nama Pabrik" />

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
                                <InputLabel htmlFor="phone_number" value="Nomor HP" />

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

                            <div className="mt-4">
                                <InputLabel htmlFor="address" value="Alamat Pabrik" />

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