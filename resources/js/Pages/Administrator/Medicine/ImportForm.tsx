import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import AdministratorLayout from "@/Layouts/AdministratorLayout";
import { PageProps } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";

import { FormEventHandler} from "react";

import { Input } from "@/Components/ui/input";

import { Button } from "@/Components/ui/button";

export default function Create({
  auth
}: PageProps) {

  const { data, setData, post, processing, progress, errors, reset } =
    useForm<{forceFormData: boolean, file_excel: any}>({
      forceFormData:true,
      file_excel: null,
    });

  // END USE REF SECTION //

  const submitForm: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("administrator.medicines.import-medicines"));
  };

  return (
    <AdministratorLayout
      user={auth.user}
      routeParent="data-obat"
      routeChild="data-obat"
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Form Import Obat
        </h2>
      }
    >
      <Head title="Form Import Obat" />

      <div className="py-12">
        <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white px-8 py-8 shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="mb-4 border-b-2 border-slate-200 py-4">
              <Button variant="secondary" asChild>
                <Link href={route("administrator.medicines")}>Kembali</Link>
              </Button>
            </div>
            <form onSubmit={submitForm}>
            {progress && (
              <progress value={progress.percentage} max="100">
                {progress.percentage}%
              </progress>
            )}
            <div>
                <InputLabel htmlFor="file-excel" value="File Excel" />

                <Input
                  id="file-excel"
                  type="file"
                  name="file_excel"
                  className="mt-1 block w-full"
                  onChange={(e) => setData('file_excel', e.target.files)}
                />

                <InputError message={errors.file_excel} className="mt-2" />
              </div>
            <div className="mt-4 w-full border-t-2 border-slate-200 py-4">
              <Button
                disabled={processing}
              >
                Simpan
              </Button>
            </div>

            </form>
          </div>
        </div>
      </div>
    </AdministratorLayout>
  );
}
