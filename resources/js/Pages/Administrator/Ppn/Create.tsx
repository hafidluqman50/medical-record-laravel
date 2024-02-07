import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { PageProps } from '@/types'
import { Ppn } from './type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'

type PpnProps = {
    ppn:Ppn
}

interface PpnForm {
    nilai_ppn: number|null
}

export default function Edit({auth, ppn}: PageProps & PpnProps) {

    const { data, setData, post, processing, errors, reset } = useForm<PpnForm>({
        nilai_ppn: null
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('administrator.ppn.store'));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="data-master"
            routeChild="data-ppn"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Ppn</h2>}
        >
            <Head title="Form Ppn" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary">
                                <Link href={route('administrator.ppn')}>Kembali</Link>
                            </Button>
                        </div>
                        
                        <form onSubmit={submitForm}>
                            <div>
                                <InputLabel htmlFor="nilai_ppn" value="Nilai Ppn" />
                                <div className="flex">
                                    <TextInput
                                        id="nilai_ppn"
                                        type="number"
                                        name="nilai_ppn"
                                        value={data.nilai_ppn?.toString()}
                                        className="mt-1 block w-full"
                                        autoComplete="nilai_ppn"
                                        isFocused={true}
                                        onChange={(e) => setData('nilai_ppn', parseInt(e.target.value))}
                                    />
                                    <Button variant="ghost" className="mt-1" type="button" disabled>%</Button>
                                </div>

                                <InputError message={errors.nilai_ppn} className="mt-2" />
                            </div>

                            <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                                <Button disabled={processing}>Tambah</Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AdministratorLayout>
    )
}