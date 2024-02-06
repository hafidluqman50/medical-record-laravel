import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types'
import { DrugClassification } from './type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'

interface DrugClassificationForm {
    name:string
    is_prekursor:number|null
    is_narcotic:number|null
    is_psychotropic:number|null
}

export default function Create({auth}: PageProps) {

    const { data, setData, post, processing, errors, reset } = useForm<DrugClassificationForm>({
        name: '',
        is_prekursor:null,
        is_narcotic:null,
        is_psychotropic:null
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('administrator.drug-classifications.store'));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="data-obat"
            routeChild="data-golongan-obat"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Golongan Obat</h2>}
        >
            <Head title="Form Golongan Obat" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.drug-classifications')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
                                <InputLabel htmlFor="name" value="Nama Kategori" />

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
                                <InputLabel htmlFor="is_prekursor" value="Prekursor" />

                                <Select onValueChange={(value) => setData('is_prekursor', parseInt(value))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Keterangan Prekursor ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">TIDAK</SelectItem>
                                    <SelectItem value="1">YA</SelectItem>
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.is_prekursor} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="is_narcotic" value="Narkotika" />

                                <Select onValueChange={(value) => setData('is_narcotic', parseInt(value))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Keterangan Narkotika ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">TIDAK</SelectItem>
                                    <SelectItem value="1">YA</SelectItem>
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.is_narcotic} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="is_psychotropic" value="Psikotropik" />

                                <Select onValueChange={(value) => setData('is_psychotropic', parseInt(value))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Keterangan Psychotropic ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">TIDAK</SelectItem>
                                    <SelectItem value="1">YA</SelectItem>
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.is_psychotropic} className="mt-2" />
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