<?php

use App\Http\Controllers\Api\DrugClassificationController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\MedicineController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'doctors'], function() {
    Route::get('/', [DoctorController::class, 'getAll']);
});

Route::group(['prefix' => 'drug-classifications'], function () {
    Route::get('/{id}', [DrugClassificationController::class, 'getById'])->name('api.drug-classifications.get-by-id');
});

Route::group(['prefix' => 'medicines'], function() {
    Route::get('/', [MedicineController::class, 'getAll'])->name('api.medicines.get-all');
    Route::get('/{id}', [MedicineController::class, 'getById'])->name('api.medicines.get-by-id');
});

Route::group(['prefix' => 'patients'], function() {
    Route::get('/', [PatientController::class, 'getAll'])->name('api.patients.get-all');
    Route::get('/{id}', [PatientController::class, 'getById'])->name('api.patients.get-by-id');
});

Route::group(['prefix' => 'doctors'], function() {
    Route::get('/', [DoctorController::class, 'getAll'])->name('api.doctors.get-all');
    Route::get('/{id}', [DoctorController::class, 'getById'])->name('api.doctors.get-by-id');
});
