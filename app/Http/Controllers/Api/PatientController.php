<?php

namespace App\Http\Controllers\Api;

use App\Models\Patient;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PatientController extends ApiBaseController
{
    public function getAll(): JsonResponse
    {
        $patients = Patient::all();

        return $this->responseResult(compact('patients'))
                    ->message('Success Get Patients!')
                    ->ok();
    }

    public function getById(int $id): JsonResponse
    {
        $patient = Patient::where('id', $id)->firstOrFail();

        return $this->responseResult(compact('patient'))
                    ->message('Success Get Patients!')
                    ->ok();
    }
}
