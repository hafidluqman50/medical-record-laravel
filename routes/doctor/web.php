<?php 

use App\Http\Controllers\Doctor\DashboardController;
use App\Http\Controllers\Doctor\MedicalRecordController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['guard.check:doctor']], function() {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('doctor.dashboard');
    
    Route::group(['prefix' => 'medical-records'], function() {
        Route::get('/', [MedicalRecordController::class, 'index'])->name('doctor.medical-records');
        Route::get('/create/{registration_id?}', [MedicalRecordController::class, 'create'])->name('doctor.medical-records.create');
        Route::post('/store', [MedicalRecordController::class, 'store'])->name('doctor.medical-records.store');
        Route::get('/list-records/{medical_record_id}', [MedicalRecordController::class, 'listRecords'])->name('doctor.medical-records.list-records');
        Route::get('/list-records/{medical_record_id}/detail-records/{medical_record_list_id}', [MedicalRecordController::class, 'detailRecords'])->name('doctor.medical-records.detail-records');
    });
});