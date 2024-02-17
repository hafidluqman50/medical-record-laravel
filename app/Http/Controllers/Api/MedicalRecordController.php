<?php

namespace App\Http\Controllers\Api;

use App\Models\Registration;
use App\Http\Controllers\ApiBaseController;
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
}
