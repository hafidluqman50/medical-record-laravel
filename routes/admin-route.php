<?php 

use App\Http\Controllers\Administrator\DoctorController;
use App\Http\Controllers\Administrator\DashboardController;
use App\Http\Controllers\Administrator\PatientController;
use App\Http\Controllers\Administrator\PatientCategoryController;
use App\Http\Controllers\Administrator\RegistrationController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'auth'], function() {
    Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['verified'])->name('administrator.dashboard');

    Route::group(['prefix' => 'doctors'], function() {
        Route::get('/', [DoctorController::class, 'index'])->name('administrator.doctors');
        Route::get('/create', [DoctorController::class, 'create'])->name('administrator.doctors.create');
        Route::post('/store', [DoctorController::class, 'store'])->name('administrator.doctors.store');
        Route::get('/edit/{id}', [DoctorController::class, 'edit'])->name('administrator.doctors.edit');
        Route::put('/update/{id}', [DoctorController::class, 'update'])->name('administrator.doctors.update');
        Route::delete('/delete/{id}', [DoctorController::class, 'delete'])->name('administrator.doctors.delete');
    });

    Route::group(['prefix' => 'patient-categories'], function() {
        Route::get('/', [PatientCategoryController::class, 'index'])->name('administrator.patient-categories');
        Route::get('/create', [PatientCategoryController::class, 'create'])->name('administrator.patient-categories.create');
        Route::post('/store', [PatientCategoryController::class, 'store'])->name('administrator.patient-categories.store');
        Route::get('/edit/{id}', [PatientCategoryController::class, 'edit'])->name('administrator.patient-categories.edit');
        Route::put('/update/{id}', [PatientCategoryController::class, 'update'])->name('administrator.patient-categories.update');
        Route::delete('/delete/{id}', [PatientCategoryController::class, 'delete'])->name('administrator.patient-categories.delete');
    });

    Route::group(['prefix' => 'patients'], function() {
        Route::get('/', [PatientController::class, 'index'])->name('administrator.patients');
        Route::get('/create', [PatientController::class, 'create'])->name('administrator.patients.create');
        Route::post('/store', [PatientController::class, 'store'])->name('administrator.patients.store');
        Route::get('/edit/{id}', [PatientController::class, 'edit'])->name('administrator.patients.edit');
        Route::put('/update/{id}', [PatientController::class, 'update'])->name('administrator.patients.update');
        Route::delete('/delete/{id}', [PatientController::class, 'delete'])->name('administrator.patients.delete');
    });

    Route::group(['prefix' => 'registrations'], function() {
        Route::get('/', [RegistrationController::class, 'index'])->name('administrator.registrations');
        Route::get('/create', [RegistrationController::class, 'create'])->name('administrator.registrations.create');
        Route::post('/store', [RegistrationController::class, 'store'])->name('administrator.registrations.store');
        Route::get('/edit/{id}', [RegistrationController::class, 'edit'])->name('administrator.registrations.edit');
        Route::put('/update/{id}', [RegistrationController::class, 'update'])->name('administrator.registrations.update');
        Route::delete('/delete/{id}', [RegistrationController::class, 'delete'])->name('administrator.registrations.delete');
    });
});