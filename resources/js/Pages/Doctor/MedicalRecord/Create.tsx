import { useState, useEffect, FormEventHandler } from 'react'
import axios, { AxiosError } from 'axios'
import DoctorLayout from '@/Layouts/DoctorLayout';
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
import { Input } from '@/Components/ui/input'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"

import { useToast } from '@/Components/ui/use-toast'

import TransactionPrescription from './TransactionPrescription'

import {
    type FormCreateProps,
    MedicalRecordForm,
    AxiosGetRegistration
} from './type'

import { columnLabActions } from './columnDatatable'

import { DataTable } from '@/Components/DataTable'

export default function Create({
    auth, patients, doctors, registrations, kode_transaksi, medicines, price_parameter, lab_actions
}: PageProps<FormCreateProps>) {

    const { toast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm<MedicalRecordForm>({
        registration_id:null,
        body_height:null,
        body_weight:null,
        body_temp:null,
        blood_pressure:'',
        complains_of_pain:'',
        anemnesis:'',
        physical_examinations:'',
        supporting_examinations:'',
        diagnose:'',
        lab_action_id:null,
        therapy:'',
        referral:'',
        next_control_date:'',
        notes:'',
        medicines: [],
        sub_total_grand: 0,
        diskon_grand: 0,
        total_grand: 0,
        bayar: 0,
        kembalian: 0,
        kode_transaksi,
        jenis_pembayaran: 'tunai'
    });

    const selectRegistrationAct = async(value: number): Promise<void> => {
        
        setData(data => ({
            ...data,
            registration_id:value
        }))

        try {
            const responseData = await axios.get<AxiosGetRegistration>(route('api.medical-records.get-registration-by-id', value))

            const { 
                body_height, body_weight, body_temp, blood_pressure, complains_of_pain, supporting_examinations 
            } = responseData.data.data.registration

            setData(data => ({
                ...data,
                body_height,
                body_weight,
                body_temp,
                blood_pressure,
                complains_of_pain,
                supporting_examinations
            }))

        } catch(error) {
            if(axios.isAxiosError(error)) {
                toast({
                  variant: "destructive",
                  title: "Error!",
                  description: error.response?.data.message,
                })
            }
        }
    }

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('doctor.medical-records.store'));
    }

    console.log(data)

    return(
        <DoctorLayout
            user={auth.user}
            routeParent="rekam-medis"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Rekam Medis</h2>}
        >
            <Head title="Form Rekam Medis" />

            <div className="py-12">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Tabs 
                                defaultValue="catatan-medis" 
                                className="w-full"
                                orientation="vertical"
                            >
                                <TabsList>
                                    <TabsTrigger value="catatan-medis">Catatan Medis</TabsTrigger>
                                    <TabsTrigger value="obat-resep">Obat Resep</TabsTrigger>
                                    <TabsTrigger value="data-tindakan">Data Tindakan</TabsTrigger>
                                </TabsList>
                                <TabsContent value="catatan-medis">
                                    <div className="border-b-2 mb-4 py-4 border-slate-200">
                                        <Button variant="secondary" asChild>
                                            <Link href={route('doctor.medical-records')}>Kembali</Link>
                                        </Button>
                                    </div>
                                    <form onSubmit={submitForm}>
                                        <div>
                                            <InputLabel htmlFor="registration_id" value="Pasien Daftar" />

                                            <Select 
                                                defaultValue={data.registration_id?.toString() ?? ''} 
                                                value={data.registration_id?.toString() ?? ''} 
                                                onValueChange={(value) => selectRegistrationAct(parseInt(value))}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="=== Pilih Pendaftaran ===" />
                                              </SelectTrigger>
                                              <SelectContent>
                                              {
                                                registrations.map((row, key) => (
                                                    <SelectItem value={row.id.toString()} key={key}>{row.number_register} | {row.patient.name} | {row.doctor.name}</SelectItem>
                                                ))
                                              }
                                              </SelectContent>
                                            </Select>

                                            <InputError message={errors.registration_id} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="body_height" value="Tinggi Badan" />
                                            
                                            <div className="flex">
                                                <Input
                                                    id="body_height"
                                                    type="number"
                                                    name="body_height"
                                                    value={data.body_height == null ? '' : data.body_height}
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
                                                <Input
                                                    id="body_weight"
                                                    type="number"
                                                    name="body_weight"
                                                    value={data.body_weight == null ? '' : data.body_weight}
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
                                                <Input
                                                    id="body_temp"
                                                    type="number"
                                                    name="body_temp"
                                                    value={data.body_temp == null ? '' : data.body_temp}
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
                                                <Input
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
                                            <InputLabel htmlFor="body_temp" value="Anemnesis" />

                                            <Input
                                                id="anemnesis"
                                                type="text"
                                                name="anemnesis"
                                                value={data.anemnesis}
                                                className="mt-1 block w-full"
                                                autoComplete="anemnesis"
                                                onChange={(e) => setData('anemnesis', e.target.value)}
                                            />

                                            <InputError message={errors.anemnesis} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="physical_examinations" value="Pemeriksaan Fisik" />

                                            <Input
                                                id="physical_examinations"
                                                type="text"
                                                name="physical_examinations"
                                                value={data.physical_examinations}
                                                className="mt-1 block w-full"
                                                autoComplete="physical_examinations"
                                                onChange={(e) => setData('physical_examinations', e.target.value)}
                                            />

                                            <InputError message={errors.physical_examinations} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="supporting_examinations" value="Pemeriksaan Penunjang" />

                                            <Input
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

                                        <div className="mt-4">
                                            <InputLabel htmlFor="diagnose" value="Diagnosa" />

                                            <Input
                                                id="diagnose"
                                                type="text"
                                                name="diagnose"
                                                value={data.diagnose}
                                                className="mt-1 block w-full"
                                                autoComplete="diagnose"
                                                onChange={(e) => setData('diagnose', e.target.value)}
                                            />

                                            <InputError message={errors.diagnose} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="lab_action_id" value="Tindakan Lab" />

                                            <Select onValueChange={(value) => setData('lab_action_id', parseInt(value))}>
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="=== Pilih Tindakan Lab ===" />
                                              </SelectTrigger>
                                              <SelectContent>
                                              {
                                                lab_actions.map((row, key) => (
                                                    <SelectItem value={row.id.toString()} key={key}>{row.name}</SelectItem>
                                                ))
                                              }
                                              </SelectContent>
                                            </Select>

                                            <InputError message={errors.lab_action_id} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="therapy" value="Terapi" />

                                            <Textarea
                                                id="therapy"
                                                name="therapy"
                                                value={data.therapy}
                                                className="mt-1 block w-full"
                                                rows={10}
                                                cols={30}
                                                onChange={(e) => setData('therapy', e.target.value)}
                                            />

                                            <InputError message={errors.therapy} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="referral" value="Rujukan" />

                                            <Input
                                                id="referral"
                                                name="referral"
                                                value={data.referral}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('referral', e.target.value)}
                                            />

                                            <InputError message={errors.referral} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="next_control_date" value="Tanggal Kontrol Selanjutnya" />

                                            <Input
                                                id="next_control_date"
                                                name="next_control_date"
                                                type="date"
                                                value={data.next_control_date}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('next_control_date', e.target.value)}
                                            />

                                            <InputError message={errors.next_control_date} className="mt-2" />
                                        </div>

                                        <div className="mt-4">
                                            <InputLabel htmlFor="notes" value="Keterangan" />

                                            <Input
                                                id="notes"
                                                name="notes"
                                                type="text"
                                                value={data.notes}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('notes', e.target.value)}
                                            />

                                            <InputError message={errors.notes} className="mt-2" />
                                        </div>

                                        <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                                            <Button disabled={processing}>Simpan</Button>
                                        </div>

                                    </form>
                                </TabsContent>
                                <TabsContent value="obat-resep">
                                    <TransactionPrescription
                                        kode_transaksi={kode_transaksi}
                                        price_parameter={price_parameter}
                                        medicines={medicines}
                                        setData={setData}
                                        reset={reset}
                                        data={data}
                                    />
                                </TabsContent>
                                <TabsContent value="data-tindakan">
                                    <div className="max-w-2xl mx-auto border-stone-100 border-2 p-4 rounded-lg backdrop-blur-lg">
                                        <DataTable columns={columnLabActions} data={lab_actions} />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    )
}