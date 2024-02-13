<?php 

use App\Http\Controllers\Administrator\DashboardController;
use App\Http\Controllers\Administrator\DistributionMedicineController;
use App\Http\Controllers\Administrator\DoctorController;
use App\Http\Controllers\Administrator\DrugClassificationController;
use App\Http\Controllers\Administrator\MedicineController;
use App\Http\Controllers\Administrator\MedicalSupplierController;
use App\Http\Controllers\Administrator\MedicineFactoryController;
use App\Http\Controllers\Administrator\OrderMedicineController;
use App\Http\Controllers\Administrator\PatientController;
use App\Http\Controllers\Administrator\PatientCategoryController;
use App\Http\Controllers\Administrator\PurchaseMedicineController;
use App\Http\Controllers\Administrator\PriceParameterController;
use App\Http\Controllers\Administrator\PpnController;
use App\Http\Controllers\Administrator\ReceivingMedicineController;
use App\Http\Controllers\Administrator\RegistrationController;
use App\Http\Controllers\Administrator\TransactionCreditController;
use App\Http\Controllers\Administrator\TransactionHvController;
use App\Http\Controllers\Administrator\TransactionResepController;
use App\Http\Controllers\Administrator\TransactionUpdsController;
use App\Http\Controllers\Administrator\CustomerController;
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

    Route::group(['prefix' => 'ppn'], function() {
        Route::get('/', [PpnController::class, 'index'])->name('administrator.ppn');
        Route::get('/create', [PpnController::class, 'create'])->name('administrator.ppn.create');
        Route::post('/store', [PpnController::class, 'store'])->name('administrator.ppn.store');
        Route::get('/edit/{id}', [PpnController::class, 'edit'])->name('administrator.ppn.edit');
        Route::put('/update/{id}', [PpnController::class, 'update'])->name('administrator.ppn.update');
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

    Route::group(['prefix' => 'transaction-resep'], function() {
        Route::get('/', [TransactionResepController::class, 'index'])->name('administrator.transaction-resep');
        Route::post('/', [TransactionResepController::class, 'store'])->name('administrator.transaction-resep.store');
        Route::get('/{id}/print', [TransactionResepController::class, 'printInvoice'])->name('administrator.transaction-resep.print-invoice');
    });

    Route::group(['prefix' => 'customers'], function() {
        Route::get('/', [CustomerController::class, 'index'])->name('administrator.customers');
        Route::get('/create', [CustomerController::class, 'create'])->name('administrator.customers.create');
        Route::post('/store', [CustomerController::class, 'store'])->name('administrator.customers.store');
        Route::get('/edit/{id}', [CustomerController::class, 'edit'])->name('administrator.customers.edit');
        Route::put('/update/{id}', [CustomerController::class, 'update'])->name('administrator.customers.update');
        Route::delete('/delete/{id}', [CustomerController::class, 'delete'])->name('administrator.customers.delete');
    });

    Route::group(['prefix' => 'transaction-credit'], function() {
        Route::get('/', [TransactionCreditController::class, 'index'])->name('administrator.transaction-credit');
        Route::post('/', [TransactionCreditController::class, 'store'])->name('administrator.transaction-credit.store');
        Route::get('/{id}/print', [TransactionCreditController::class, 'printInvoice'])->name('administrator.transaction-credit.print-invoice');
    });

    Route::group(['prefix' => 'purchase-medicines'], function() {
        Route::get('/', [PurchaseMedicineController::class, 'index'])->name('administrator.purchase-medicines');
        Route::get('/create', [PurchaseMedicineController::class, 'create'])->name('administrator.purchase-medicines.create');
        Route::post('/store', [PurchaseMedicineController::class, 'store'])->name('administrator.purchase-medicines.store');
        Route::get('/detail/{id}', [PurchaseMedicineController::class, 'detail'])->name('administrator.purchase-medicines.detail');
        Route::delete('/delete/{id}', [PurchaseMedicineController::class, 'delete'])->name('administrator.purchase-medicines.delete');
        Route::get('/print/{id}', [PurchaseMedicineController::class, 'printInvoice'])->name('administrator.purchase-medicines.print');
    });

    Route::group(['prefix' => 'order-medicines'], function() {
        Route::get('/', [OrderMedicineController::class, 'index'])->name('administrator.order-medicines');
        Route::get('/create', [OrderMedicineController::class, 'create'])->name('administrator.order-medicines.create');
        Route::post('/store', [OrderMedicineController::class, 'store'])->name('administrator.order-medicines.store');
        Route::get('/detail/{id}', [OrderMedicineController::class, 'detail'])->name('administrator.order-medicines.detail');
        Route::delete('/delete/{id}', [OrderMedicineController::class, 'delete'])->name('administrator.order-medicines.delete');
    });

    Route::group(['prefix' => 'receiving-medicines'], function() {
        Route::get('/', [ReceivingMedicineController::class, 'index'])->name('administrator.receiving-medicines');
        Route::get('/create', [ReceivingMedicineController::class, 'create'])->name('administrator.receiving-medicines.create');
        Route::post('/store', [ReceivingMedicineController::class, 'store'])->name('administrator.receiving-medicines.store');
        Route::get('/detail/{id}', [ReceivingMedicineController::class, 'detail'])->name('administrator.receiving-medicines.detail');
        Route::delete('/delete/{id}', [ReceivingMedicineController::class, 'delete'])->name('administrator.receiving-medicines.delete');
    });

    Route::group(['prefix' => 'distribution-medicines'], function() {
        Route::get('/', [DistributionMedicineController::class, 'index'])->name('administrator.distribution-medicines');
        Route::get('/create', [DistributionMedicineController::class, 'create'])->name('administrator.distribution-medicines.create');
        Route::post('/store', [DistributionMedicineController::class, 'store'])->name('administrator.distribution-medicines.store');
        Route::get('/detail/{id}', [DistributionMedicineController::class, 'detail'])->name('administrator.distribution-medicines.detail');
        Route::delete('/delete/{id}', [DistributionMedicineController::class, 'delete'])->name('administrator.distribution-medicines.delete');
    });

    Route::group(['prefix' => 'users'], function() {
        Route::get('/', [UserController::class, 'index'])->name('administrator.users');
        Route::get('/create', [UserController::class, 'create'])->name('administrator.users.create');
        Route::post('/store', [UserController::class, 'store'])->name('administrator.users.store');
        Route::get('/edit/{id}', [UserController::class, 'edit'])->name('administrator.users.edit');
        Route::put('/update/{id}', [UserController::class, 'update'])->name('administrator.users.update');
        Route::patch('/update-status/{id}', [UserController::class, 'updateStatus'])->name('administrator.users.update-status');
        Route::delete('/delete/{id}', [UserController::class, 'delete'])->name('administrator.users.delete');
    });
});