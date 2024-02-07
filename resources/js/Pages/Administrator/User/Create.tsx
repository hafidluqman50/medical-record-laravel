import { useState, useEffect, FormEventHandler } from 'react'
import axios from 'axios'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types'
import { User, Role } from './type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from '@/Components/ui/button'

interface UserForm {
    name:string
    username:string
    password:string
    role_id:number|null
}

type CreatePageProps = {
    roles:Role[]
}

export default function Create({auth, roles}: PageProps & CreatePageProps) {

    const { data, setData, post, processing, errors, reset } = useForm<UserForm>({
        name: '',
        username: '',
        password: '',
        role_id:null
    });

    const submitForm: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('administrator.users.store'));
    }

    return(
        <AdministratorLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Form Data Petugas</h2>}
        >
            <Head title="Form Data Petugas" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg py-8 px-8">
                        <div className="border-b-2 mb-4 py-4 border-slate-200">
                            <Button variant="secondary" asChild>
                                <Link href={route('administrator.users')}>Kembali</Link>
                            </Button>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
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
                                <InputLabel htmlFor="role_id" value="Role" />

                                <Select onValueChange={(value) => setData('role_id', parseInt(value))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="=== Pilih Role ===" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {
                                    roles.map((row, key) => (
                                        <SelectItem value={row.id.toString()}>{row.name}</SelectItem>
                                    ))
                                  }
                                  </SelectContent>
                                </Select>

                                <InputError message={errors.role_id} className="mt-2" />
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