<?php

namespace App\Http\Controllers\Api;

use App\Models\MedicalRecord;
use App\Models\MedicalRecordDetail;
use App\Models\MedicalRecordList;
use App\Models\Registration;
use App\Http\Controllers\ApiBaseController;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicalRecordController extends ApiBaseController
{
    public function getRegisterById(int $id): JsonResponse
    {
        $registration = Registration::where('id', $id)->firstOrFail();

        return $this->responseResult(compact('registration'))
                    ->message('Success Get Registration By Id')
                    ->ok();
    }

    public function getPatients(Request $request): JsonResponse
    {
        $search = $request->search;
        
        $page_num = $request->page_num;

        $medical_records = MedicalRecord::with(['patient'])->when($page_num != '', function(Builder $query) use ($page_num) {
            $query->offset($page_num)->limit(5);
        })->when($search != '', function(Builder $query) use ($search) {
            $query->whereHas('patient', function(Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            });
        })->get();

        $count = MedicalRecord::whereHas('patient', function(Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })->count();



        $max_page = ceil($count / 5);

        return $this->responseResult(compact('medical_records', 'max_page'))
                    ->message('Success Get Medical Record Patient')
                    ->ok();
    }

    public function getMedicalRecordLists(Request $request, int $id): JsonResponse
    {
        $search = $request->search;
        
        $page_num = $request->page_num;

        $medical_record_lists = MedicalRecordList::with(['registration.patient','registration.doctor', 'labAction'])
        ->when($page_num != '', function(Builder $query) use ($page_num) {
            $query->offset($page_num)->limit(5);
        })
        ->when($search != '', function(Builder $query) use ($search) {
            $query->whereHas('registration.patient', function(Builder $queryHas) use ($search) {
                $queryHas->where('name', 'like', "%{$search}%");
            })->orWhereHas('registration.doctor', function(Builder $queryHas) use ($search) {
                $queryHas->where('name', 'like', "%{$search}%");
            });
        })->where('medical_record_id', $id)->get();

        $count = MedicalRecordList::whereHas('registration.patient', function(Builder $queryHas) use ($search) {
                $queryHas->where('name', 'like', "%{$search}%");
            })->orWhereHas('registration.doctor', function(Builder $queryHas) use ($search) {
                $queryHas->where('name', 'like', "%{$search}%");
            })->where('medical_record_id', $id)->count();

        $max_page = ceil($count / 5);

        return $this->responseResult(compact('medical_record_lists', 'max_page'))
                    ->message('Success Get Medical Record Lists')
                    ->ok();
    }

    public function getMedicalRecordDetails(Request $request, int $medical_record_id, int $medical_record_list_id): JsonResponse
    {

        $search = $request->search;
        $page_num = $request->page_num;

        $medical_record_details = MedicalRecordDetail::with(['medicalRecordList', 'medicine'])
                                ->when($page_num != '', function(Builder $query) use ($page_num) {
                                    $query->offset($page_num)->limit(5);
                                })
                                ->when($search != '', function(Builder $query) use ($search) {
                                    $query->whereHas('medicine', function(Builder $queryHas) use ($search) {
                                        $queryHas->where('name', 'like', "%{$search}%");
                                    });
                                })
                                ->whereHas('medicalRecordList', function(Builder $queryHas) use ($medical_record_id){
                                    $queryHas->where('medical_record_id', $medical_record_id);
                                })
                                ->where('medical_record_list_id', $medical_record_list_id)
                                ->get();

        $count = MedicalRecordDetail::with(['medicalRecordList', 'medicine'])
                                ->when($search != '', function(Builder $query) use ($search) {
                                    $query->whereHas('medicine', function(Builder $queryHas) use ($search) {
                                        $queryHas->where('name', 'like', "%{$search}%");
                                    });
                                })
                                ->whereHas('medicalRecordList', function(Builder $queryHas) use ($medical_record_id){
                                    $queryHas->where('medical_record_id', $medical_record_id);
                                })
                                ->where('medical_record_list_id', $medical_record_list_id)
                                ->count();

        $max_page = ceil($count / 5);

        return $this->responseResult(compact('medical_record_details', 'max_page'))
                    ->message('Success Get Medical Record Details')
                    ->ok();
    }
}
