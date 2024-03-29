import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import AdministratorLayout from "@/Layouts/AdministratorLayout";
import { PageProps } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface MedicalSupplierForm {
  name: string;
  abbreviation_name: string;
  phone_number: string;
  address: string;
}

interface MedicalSupplier extends MedicalSupplierForm {
  id: number;
}

type EditFormProps = {
  medical_supplier: MedicalSupplier;
};

export default function Edit({
  auth,
  medical_supplier,
}: PageProps<EditFormProps>) {
  const { data, setData, put, processing, errors, reset } =
    useForm<MedicalSupplierForm>({
      name: medical_supplier.name,
      abbreviation_name: medical_supplier.abbreviation_name,
      phone_number: medical_supplier.phone_number,
      address: medical_supplier.address,
    });

  const submitForm: FormEventHandler = (e) => {
    e.preventDefault();

    put(route("administrator.medical-suppliers.update", medical_supplier.id));
  };

  return (
    <AdministratorLayout
      user={auth.user}
      routeParent="data-obat"
      routeChild="data-golongan-obat"
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Form Supplier Obat
        </h2>
      }
    >
      <Head title="Form Supplier Obat" />

      <div className="py-12">
        <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white px-8 py-8 shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="mb-4 border-b-2 border-slate-200 py-4">
              <Button variant="secondary" asChild>
                <Link href={route("administrator.medical-suppliers")}>
                  Kembali
                </Link>
              </Button>
            </div>
            <form onSubmit={submitForm}>
              <div>
                <InputLabel htmlFor="name" value="Nama Supplier" />

                <TextInput
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  autoComplete="name"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />

                <InputError message={errors.name} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel
                  htmlFor="abbreviation_name"
                  value="Singkatan Nama Supplier"
                />

                <TextInput
                  id="abbreviation_name"
                  type="text"
                  name="abbreviation_name"
                  value={data.abbreviation_name}
                  className="mt-1 block w-full"
                  autoComplete="abbreviation_name"
                  onChange={(e) => setData("abbreviation_name", e.target.value)}
                />

                <InputError
                  message={errors.abbreviation_name}
                  className="mt-2"
                />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="phone_number" value="Nomor HP" />

                <TextInput
                  id="phone_number"
                  type="number"
                  name="phone_number"
                  value={data.phone_number}
                  className="mt-1 block w-full"
                  autoComplete="phone_number"
                  onChange={(e) => setData("phone_number", e.target.value)}
                />

                <InputError message={errors.phone_number} className="mt-2" />
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="address" value="Alamat Supplier" />

                <Textarea
                  name="address"
                  className="mt-1 block w-full focus:border-indigo-700"
                  value={data.address}
                  rows={10}
                  cols={10}
                  onChange={(e) => setData("address", e.target.value)}
                />

                <InputError message={errors.address} className="mt-2" />
              </div>

              <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
                <Button variant="warning" disabled={processing}>
                  Edit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdministratorLayout>
  );
}
