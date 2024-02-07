import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types'
import { PriceParameter } from './type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'

interface PriceParameterForm {
    label:string;
    resep_tunai:number|null;
    upds:number|null;
    hv_otc:number|null;
    resep_kredit:number|null;
    enggros_faktur:number|null;
    embalase:number|null;
    jasa_racik:number|null;
    pembulatan:number|null;
}

type EditFormProps = {
    price_parameter:PriceParameter
}

export default function Edit({auth, price_parameter}: PageProps & EditFormProps) {

    const { data, setData, put, processing, errors, reset } = useForm<PriceParameterForm>({
        label:price_parameter.label,
        resep_tunai:price_parameter.resep_tunai,
        upds:price_parameter.upds,
        hv_otc:price_parameter.hv_otc,
        resep_kredit:price_parameter.resep_kredit,
        enggros_faktur:price_parameter.enggros_faktur,
        embalase:price_parameter.embalase,
        jasa_racik:price_parameter.jasa_racik,
        pembulatan:price_parameter.pembulatan,
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        put(route('administrator.price-parameters.update', price_parameter.id));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            routeParent="data-obat"
            routeChild="data-golongan-obat"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Parameter Harga</h2>}
        >
            <Head title="Form Parameter Harga" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.price-parameters')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
                                <InputLabel htmlFor="label" value="Label" />

                                <TextInput
                                    id="label"
                                    type="text"
                                    name="label"
                                    value={data.label}
                                    className="mt-1 block w-full"
                                    autoComplete="label"
                                    isFocused={true}
                                    onChange={(e) => setData('label', e.target.value)}
                                />

                                <InputError message={errors.label} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="resep_tunai" value="Resep Tunai" />

                                <TextInput
                                    id="resep_tunai"
                                    type="number"
                                    name="resep_tunai"
                                    value={data.resep_tunai?.toString()}
                                    className="mt-1 block w-full"
                                    autoComplete="resep_tunai"
                                    onChange={(e) => setData('resep_tunai', parseFloat(e.target.value))}
                                />

                                <InputError message={errors.resep_tunai} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="upds" value="UPDS" />

                                <TextInput
                                    id="upds"
                                    type="number"
                                    name="upds"
                                    value={data.upds?.toString()}
                                    className="mt-1 block w-full"
                                    autoComplete="upds"
                                    onChange={(e) => setData('upds', parseFloat(e.target.value))}
                                />

                                <InputError message={errors.upds} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="hv_otc" value="HV/OTC" />

                                <TextInput
                                    id="hv_otc"
                                    type="number"
                                    name="hv_otc"
                                    value={data.hv_otc?.toString()}
                                    className="mt-1 block w-full"
                                    autoComplete="hv_otc"
                                    onChange={(e) => setData('hv_otc', parseFloat(e.target.value))}
                                />

                                <InputError message={errors.hv_otc} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="resep_kredit" value="Resep Kredit" />

                                <TextInput
                                    id="resep_kredit"
                                    type="number"
                                    name="resep_kredit"
                                    value={data.resep_kredit?.toString()}
                                    className="mt-1 block w-full"
                                    autoComplete="resep_kredit"
                                    onChange={(e) => setData('resep_kredit', parseFloat(e.target.value))}
                                />

                                <InputError message={errors.resep_kredit} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="enggros_faktur" value="Enggros Faktur" />

                                <TextInput
                                    id="enggros_faktur"
                                    type="number"
                                    name="enggros_faktur"
                                    value={data.enggros_faktur?.toString()}
                                    className="mt-1 block w-full"
                                    autoComplete="enggros_faktur"
                                    onChange={(e) => setData('enggros_faktur', parseFloat(e.target.value))}
                                />

                                <InputError message={errors.enggros_faktur} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="embalase" value="Embalase" />

                                <TextInput
                                    id="embalase"
                                    type="number"
                                    name="embalase"
                                    value={data.embalase?.toString()}
                                    className="mt-1 block w-full"
                                    autoComplete="embalase"
                                    onChange={(e) => setData('embalase', parseInt(e.target.value))}
                                />

                                <InputError message={errors.embalase} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="jasa_racik" value="Jasa Racik" />

                                <TextInput
                                    id="jasa_racik"
                                    type="number"
                                    name="jasa_racik"
                                    value={data.jasa_racik?.toString()}
                                    className="mt-1 block w-full"
                                    autoComplete="jasa_racik"
                                    onChange={(e) => setData('jasa_racik', parseInt(e.target.value))}
                                />

                                <InputError message={errors.jasa_racik} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="pembulatan" value="Pembulatan" />

                                <TextInput
                                    id="pembulatan"
                                    type="number"
                                    name="pembulatan"
                                    value={data.pembulatan?.toString()}
                                    className="mt-1 block w-full"
                                    autoComplete="pembulatan"
                                    onChange={(e) => setData('pembulatan', parseInt(e.target.value))}
                                />

                                <InputError message={errors.pembulatan} className="mt-2" />
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