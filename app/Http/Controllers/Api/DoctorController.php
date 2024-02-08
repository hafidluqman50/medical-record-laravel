<?php

namespace App\Http\Controllers\Api;

use App\Models\Doctor;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DoctorController extends ApiBaseController
{
    public function getAll(): JsonResponse
    {
        $doctors = Doctor::all();

        return $this->responseResult(compact('doctors'))
                    ->message('Success Get Doctors!')
                    ->ok();
    }

    public function getById(int $id): JsonResponse
    {
        $doctor = Doctor::where('id', $id)->firstOrFail();

        return $this->responseResult(compact('doctor'))
                    ->message('Success Get Doctors!')
                    ->ok();
    }
}
