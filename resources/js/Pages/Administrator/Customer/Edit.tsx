import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types'
import { Customer } from './type'
import { PriceParameter } from '@/Pages/Administrator/PriceParameter/type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'

interface CustomerForm {
    debitur_number:string
    name:string
    price_parameter_id:number
}

type CreatePageProps = {
    customer:Customer
    price_parameters:PriceParameter[]
}

export default function Edit({auth, customer, price_parameters}: PageProps & CreatePageProps) {

    const { data, setData, put, processing, errors, reset } = useForm<CustomerForm>({
        debitur_number: customer.debitur_number,
        name: customer.name,
        price_parameter_id: customer.price_parameter_id,
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        put(route('administrator.customers.update', customer.id));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Data Customer</h2>}
        >
            <Head title="Form Data Customer" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.customers')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>

                            <div>
                                <InputLabel htmlFor="debitur_number" value="Username" />

                                <TextInput
                                    id="debitur_number"
                                    type="text"
                                    name="debitur_number"
                                    value={data.debitur_number}
                                    className="mt-1 block w-full"
                                    autoComplete="debitur_number"
                                    onChange={(e) => setData('debitur_number', e.target.value)}
                                    readOnly
                                />

                                <InputError message={errors.debitur_number} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="name" value="Nama" />

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
                                <InputLabel htmlFor="price_parameter_id" value="Parameter Harga" />

                                <Select defaultValue={data.price_parameter_id.toString()} onValueChange={(value) => setData('price_parameter_id', parseInt(value))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Parameter Harga ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {
                                    price_parameters.map((row, key) => (
                                        <SelectItem value={row.id.toString()}>{row.label}</SelectItem>
                                    ))
                                  }
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.price_parameter_id} className="mt-2" />
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