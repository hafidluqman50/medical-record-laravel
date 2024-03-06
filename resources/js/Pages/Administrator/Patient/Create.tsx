import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import { PageProps, PatientCategory } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

type PatientCreateProps = {
    code:string;
    patient_categories:PatientCategory[]
}

interface PatientForm {
    code: string,
    name: string,
    bpjs_number: string,
    patient_category_id: number|null,
    city_place: string,
    birth_date: string,
    address: string,
    phone_number: string
}

export default function Create({auth, code, patient_categories}: PageProps<PatientCreateProps>) {

    const { data, setData, post, processing, errors, reset } = useForm<PatientForm>({
        code,
        name: '',
        bpjs_number: '',
        patient_category_id:0,
        city_place:'',
        birth_date: '',
        address:'',
        phone_number:''
    });
    
    const patientCategoryRef = useRef<any>()
    const nameRef = useRef<any>()
    const bpjsNumberRef = useRef<any>()
    const cityPlaceRef = useRef<any>()
    const birthDateRef = useRef<any>()
    const addressRef = useRef<any>()
    const phoneNumberRef = useRef<any>()
    const submitRef = useRef<any>()

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
                        <form onSubmit={(event) => event.preventDefault()}>
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
                                  <SelectTrigger ref={patientCategoryRef} className="w-full" autoFocus>
                                    <SelectValue placeholder="=== Pilih Kategori Pasien ===" />
                                  </SelectTrigger>
                                  <SelectContent onCloseAutoFocus={(event) => {
                                    event.preventDefault()
                                    
                                    nameRef.current.focus()
                                  }}>
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
                                    ref={nameRef}
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    onChange={(e) => setData('name', e.target.value)}
                                    onKeyPress={(event) => {
                                      if(event.key === 'Enter') {
                                        bpjsNumberRef.current.focus()
                                      }
                                    }}
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="bpjs_number" value="Nomor BPJS" />

                                <TextInput
                                    ref={bpjsNumberRef}
                                    id="bpjs_number"
                                    type="text"
                                    name="bpjs_number"
                                    value={data.bpjs_number}
                                    className="mt-1 block w-full"
                                    autoComplete="bpjs_number"
                                    onChange={(e) => setData('bpjs_number', e.target.value)}
                                    onKeyPress={(event) => {
                                      if(event.key === 'Enter') {
                                        cityPlaceRef.current.focus()
                                      }
                                    }}
                                />

                                <InputError message={errors.bpjs_number} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="city_place" value="Kota Pasien" />

                                <TextInput
                                    ref={cityPlaceRef}
                                    id="city_place"
                                    type="text"
                                    name="city_place"
                                    value={data.city_place}
                                    className="mt-1 block w-full"
                                    autoComplete="city_place"
                                    onChange={(e) => setData('city_place', e.target.value)}
                                    onKeyPress={(event) => {
                                      if(event.key === 'Enter') {
                                        birthDateRef.current.focus()
                                      }
                                    }}
                                />

                                <InputError message={errors.city_place} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="birth_date" value="Tanggal Lahir" />

                                <TextInput
                                    ref={birthDateRef}
                                    id="birth_date"
                                    type="date"
                                    name="birth_date"
                                    value={data.birth_date}
                                    className="mt-1 block w-full"
                                    autoComplete="birth_date"
                                    onChange={(e) => setData('birth_date',e.target.value)}
                                    onKeyPress={(event) => {
                                      if(event.key === 'Enter') {
                                        addressRef.current.focus()
                                      }
                                    }}
                                />

                                <InputError message={errors.birth_date} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="address" value="Alamat Pasien" />

                                <Textarea 
                                    ref={addressRef}
                                    name="address"
                                    className="mt-1 block w-full focus:border-indigo-700" 
                                    value={data.address}
                                    rows={10}
                                    cols={10}
                                    onChange={(e) => setData('address', e.target.value)}
                                    onKeyPress={(event) => {
                                      if(event.key === 'Enter') {
                                        phoneNumberRef.current.focus()
                                      }
                                    }}
                                />

                                <InputError message={errors.address} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="phone_number" value="Nomor HP Pasien" />

                                <TextInput
                                    ref={phoneNumberRef}
                                    id="phone_number"
                                    type="number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    className="mt-1 block w-full"
                                    autoComplete="phone_number"
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    onKeyPress={(event) => {
                                      if(event.key === 'Enter') {
                                        submitRef.current.focus()
                                      }
                                    }}
                                />

                                <InputError message={errors.phone_number} className="mt-2" />
                            </div>

                            <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                                <Button 
                                    ref={submitRef} 
                                    disabled={processing} 
                                    onClick={(event) => submitForm(event)}
                                    type="button"
                                >Simpan</Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AdministratorLayout>
    )
}