<?php 

use App\Http\Controllers\Doctor\DashboardController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['guard.check:doctor']], function() {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('doctor.dashboard');
    
    Route::group(['prefix' => 'medical-records'], function() {
        Route::get('/', [MedicalRecordController::class, 'index'])->name('administrator.medical-records');
        Route::get('/create', [MedicalRecordController::class, 'create'])->name('administrator.medical-records.create');
        Route::post('/store', [MedicalRecordController::class, 'store'])->name('administrator.medical-records.store');
        Route::get('/list-records/{medical_record_id}', [MedicalRecordController::class, 'listRecords'])->name('administrator.medical-records.list-records');
        Route::get('/list-records/{medical_record_id}/detail-records/{medical_record_list_id}', [MedicalRecordController::class, 'detailRecords'])->name('administrator.medical-records.detail-records');
    });
});