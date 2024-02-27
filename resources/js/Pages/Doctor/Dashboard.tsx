import { useState } from 'react'
import DoctorLayout from '@/Layouts/DoctorLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Calendar } from "@/Components/ui/calendar"

export default function Dashboard({ auth }: PageProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <DoctorLayout
            user={auth.doctor}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">Welcome {auth.doctor.name}! You're logged in as DOCTOR!</div>
                    </div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="max-w-fit mt-4 bg-white rounded-md border shadow"
                    />
                </div>
            </div>
        </DoctorLayout>
    );
}
