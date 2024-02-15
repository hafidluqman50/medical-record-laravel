import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, router } from '@inertiajs/react';
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

type PatientCategoryProps = {
    patient_category:PatientCategory
}

interface PatientCategoryForm {
    name: string
}

export default function Edit({auth, patient_category}: PageProps & PatientCategoryProps) {

    const { data, setData, post, put, processing, errors, reset } = useForm<PatientCategoryForm>({
        name: patient_category.name
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        put(route('administrator.patient-categories.update',patient_category.id));
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
                                <Link href={route('administrator.patient-categories')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
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