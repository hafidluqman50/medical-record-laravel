<?php

namespace App\Http\Controllers\Api;

use App\Models\Patient;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PatientController extends ApiBaseController
{
    public function getAll(Request $request): JsonResponse
    {
        $search = $request->search;
        
        $patients = Patient::when($search != '', function(Builder $query)use($search){
            $query->where('name','like',"%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
        })->get();

        $count = $patients->count();

        return $this->responseResult(compact('patients','count'))
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
