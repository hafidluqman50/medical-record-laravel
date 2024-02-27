<?php

namespace App\Http\Controllers\Api;

use App\Models\Doctor;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DoctorController extends ApiBaseController
{
    public function getAll(Request $request): JsonResponse
    {
        $search = $request->search;

        $doctors = Doctor::when($search != '', function(Builder $query)use($search){
            $query->where('name','like',"%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
        })->get();

        $count = $doctors->count();

        return $this->responseResult(compact('doctors', 'count'))
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
