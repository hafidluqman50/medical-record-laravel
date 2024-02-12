<?php

namespace App\Http\Controllers\Api;

use App\Models\MedicalSupplier;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicalSupplierController extends ApiBaseController
{
    public function getById(int $id): JsonResponse
    {
        $medical_supplier = MedicalSupplier::where('id', $id)->firstOrFail();

        return $this->responseResult(compact('medical_supplier'))
                    ->message('Success Get Medical Supplier By Id')
                    ->ok();
    }
}
