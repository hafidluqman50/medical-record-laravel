<?php 

use App\Http\Controllers\Administrator\DashboardController;
use App\Http\Controllers\Administrator\DoctorController;
use App\Http\Controllers\Administrator\DrugClassificationController;
use App\Http\Controllers\Administrator\MedicineController;
use App\Http\Controllers\Administrator\MedicalSupplierController;
use App\Http\Controllers\Administrator\MedicineFactoryController;
use App\Http\Controllers\Administrator\PatientController;
use App\Http\Controllers\Administrator\PatientCategoryController;
use App\Http\Controllers\Administrator\PriceParameterController;
use App\Http\Controllers\Administrator\RegistrationController;
use App\Http\Controllers\Administrator\TransactionUpdsController;
use App\Http\Controllers\Administrator\TransactionHvController;
use App\Http\Controllers\Administrator\UserController;
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

    Route::group(['prefix' => 'drug-classifications'], function() {
        Route::get('/', [DrugClassificationController::class, 'index'])->name('administrator.drug-classifications');
        Route::get('/create', [DrugClassificationController::class, 'create'])->name('administrator.drug-classifications.create');
        Route::post('/store', [DrugClassificationController::class, 'store'])->name('administrator.drug-classifications.store');
        Route::get('/edit/{id}', [DrugClassificationController::class, 'edit'])->name('administrator.drug-classifications.edit');
        Route::put('/update/{id}', [DrugClassificationController::class, 'update'])->name('administrator.drug-classifications.update');
        Route::delete('/delete/{id}', [DrugClassificationController::class, 'delete'])->name('administrator.drug-classifications.delete');
    });

    Route::group(['prefix' => 'medical-suppliers'], function() {
        Route::get('/', [MedicalSupplierController::class, 'index'])->name('administrator.medical-suppliers');
        Route::get('/create', [MedicalSupplierController::class, 'create'])->name('administrator.medical-suppliers.create');
        Route::post('/store', [MedicalSupplierController::class, 'store'])->name('administrator.medical-suppliers.store');
        Route::get('/edit/{id}', [MedicalSupplierController::class, 'edit'])->name('administrator.medical-suppliers.edit');
        Route::put('/update/{id}', [MedicalSupplierController::class, 'update'])->name('administrator.medical-suppliers.update');
        Route::delete('/delete/{id}', [MedicalSupplierController::class, 'delete'])->name('administrator.medical-suppliers.delete');
    });

    Route::group(['prefix' => 'medicine-factories'], function() {
        Route::get('/', [MedicineFactoryController::class, 'index'])->name('administrator.medicine-factories');
        Route::get('/create', [MedicineFactoryController::class, 'create'])->name('administrator.medicine-factories.create');
        Route::post('/store', [MedicineFactoryController::class, 'store'])->name('administrator.medicine-factories.store');
        Route::get('/edit/{id}', [MedicineFactoryController::class, 'edit'])->name('administrator.medicine-factories.edit');
        Route::put('/update/{id}', [MedicineFactoryController::class, 'update'])->name('administrator.medicine-factories.update');
        Route::delete('/delete/{id}', [MedicineFactoryController::class, 'delete'])->name('administrator.medicine-factories.delete');
    });

    Route::group(['prefix' => 'medicines'], function() {
        Route::get('/', [MedicineController::class, 'index'])->name('administrator.medicines');
        Route::get('/create', [MedicineController::class, 'create'])->name('administrator.medicines.create');
        Route::post('/store', [MedicineController::class, 'store'])->name('administrator.medicines.store');
        Route::get('/edit/{id}', [MedicineController::class, 'edit'])->name('administrator.medicines.edit');
        Route::put('/update/{id}', [MedicineController::class, 'update'])->name('administrator.medicines.update');
        Route::delete('/delete/{id}', [MedicineController::class, 'delete'])->name('administrator.medicines.delete');
    });

    Route::group(['prefix' => 'price-parameters'], function() {
        Route::get('/', [PriceParameterController::class, 'index'])->name('administrator.price-parameters');
        Route::get('/create', [PriceParameterController::class, 'create'])->name('administrator.price-parameters.create');
        Route::post('/store', [PriceParameterController::class, 'store'])->name('administrator.price-parameters.store');
        Route::get('/edit/{id}', [PriceParameterController::class, 'edit'])->name('administrator.price-parameters.edit');
        Route::put('/update/{id}', [PriceParameterController::class, 'update'])->name('administrator.price-parameters.update');
        Route::delete('/delete/{id}', [PriceParameterController::class, 'delete'])->name('administrator.price-parameters.delete');
    });

    Route::group(['prefix' => 'transaction-upds'], function() {
        Route::get('/', [TransactionUpdsController::class, 'index'])->name('administrator.transaction-upds');
        Route::post('/', [TransactionUpdsController::class, 'store'])->name('administrator.transaction-upds.store');
        Route::get('/{id}/print', [TransactionUpdsController::class, 'printInvoice'])->name('administrator.transaction-upds.print-invoice');
    });

    Route::group(['prefix' => 'transaction-hv'], function() {
        Route::get('/', [TransactionHvController::class, 'index'])->name('administrator.transaction-hv');
        Route::post('/', [TransactionHvController::class, 'store'])->name('administrator.transaction-hv.store');
        Route::get('/{id}/print', [TransactionHvController::class, 'printInvoice'])->name('administrator.transaction-hv.print-invoice');
    });

    Route::group(['prefix' => 'users'], function() {
        Route::get('/', [UserController::class, 'index'])->name('administrator.users');
        Route::get('/create', [UserController::class, 'create'])->name('administrator.users.create');
        Route::post('/store', [UserController::class, 'store'])->name('administrator.users.store');
        Route::get('/edit/{id}', [UserController::class, 'edit'])->name('administrator.users.edit');
        Route::put('/update/{id}', [UserController::class, 'update'])->name('administrator.users.update');
        Route::put('/update-status/{id}', [UserController::class, 'updateStatus'])->name('administrator.users.update-status');
        Route::delete('/delete/{id}', [UserController::class, 'delete'])->name('administrator.users.delete');
    });
});