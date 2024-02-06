<?php

namespace App\Http\Controllers\Api;

use App\Models\DrugClassification;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DrugClassificationController extends Controller
{
    public function getById(int $id): JsonResponse
    {
        $drug_classification = DrugClassification::where('id',$id)->first();

        return response()->json(compact('drug_classification'));
    }
}
