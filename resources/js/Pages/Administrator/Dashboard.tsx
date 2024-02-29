import { useState } from 'react'
import AdministratorLayout from '@/Layouts/AdministratorLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Calendar } from "@/Components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import { PersonIcon } from '@radix-ui/react-icons'
import { 
    Banknote, 
    Tablets, 
    Stethoscope,
    HeartPulse
} from 'lucide-react'
import { formatRupiah } from '@/lib/helper'

export default function Dashboard({ 
    auth, total_medicines, total_sales, total_patients, total_doctors 
}: PageProps & {
    total_medicines:number
    total_sales:number
    total_patients:number
    total_doctors:number
}) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <AdministratorLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex w-full space-x-4">
                        <Card className="w-4/12 mb-4">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div>
                                        Total Data Obat
                                    </div>
                                    <Tablets size={20} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {total_medicines}
                            </CardContent>
                        </Card>
                        <Card className="w-4/12 mb-4">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div>
                                        Total Penjualan
                                    </div>
                                    <Banknote size={20} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                Rp. {formatRupiah(total_sales)},00
                            </CardContent>
                        </Card>
                        <Card className="w-4/12 mb-4">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div>
                                        Total Pasien
                                    </div>
                                    <HeartPulse size={20} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {total_patients}
                            </CardContent>
                        </Card>
                        <Card className="w-4/12 mb-4">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <div>
                                        Total Dokter
                                    </div>
                                    <Stethoscope size={20} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {total_doctors}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">Welcome {auth.user.name}! You're logged in as ADMINISTRATOR!</div>
                    </div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="max-w-fit mt-4 bg-white rounded-md border shadow"
                    />
                </div>
            </div>
        </AdministratorLayout>
    );
}
