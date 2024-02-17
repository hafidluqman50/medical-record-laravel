<?php

use App\Http\Controllers\Api\DrugClassificationController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\MedicalRecordController;
use App\Http\Controllers\Api\MedicalSupplierController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PurchaseMedicineController;
use App\Http\Controllers\Api\TransactionController;
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

Route::group(['prefix' => 'medical-suppliers'], function() {
    Route::get('/{id}', [MedicalSupplierController::class, 'getById'])->name('api.medical-suppliers.get-by-id');
});

Route::group(['prefix' => 'transactions'], function() {
    Route::get('/get-by-date/{date}', [TransactionController::class, 'getByDate'])->name('api.transactions.get-by-date');
    Route::get('/get-by-invoice/{invoice}', [TransactionController::class, 'getByInvoice'])->name('api.transactions.get-by-invoice');
});

Route::group(['prefix' => 'medical-records'], function() {
    Route::get('/get-registration-by-id/{id}', [MedicalRecordController::class, 'getRegisterById'])->name('api.medical-records.get-registration-by-id');
});

Route::group(['prefix' => 'purchases'], function() {
    Route::get('/get-by-date/{date}', [PurchaseMedicineController::class, 'getByDate'])->name('api.purchases.get-by-date');
    Route::get('/get-by-invoice/{invoice}', [PurchaseMedicineController::class, 'getByInvoice'])->name('api.purchases.get-by-invoice');
});
