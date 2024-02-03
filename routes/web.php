<?php

use App\Http\Controllers\Administrator\DoctorController as AdminDoctorController;
use App\Http\Controllers\Administrator\DashboardController as AdminDashboardController;
use App\Http\Controllers\Administrator\PatientCategoryController as AdminPatientCategoryController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::group(['prefix' => 'administrator', 'middleware' => 'auth'], function() {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])
    ->middleware(['verified'])->name('administrator.dashboard');

    Route::group(['prefix' => 'doctors'], function() {
        Route::get('/', [AdminDoctorController::class, 'index'])->name('administrator.doctors');
        Route::get('/create', [AdminDoctorController::class, 'create'])->name('administrator.doctors.create');
        Route::post('/store', [AdminDoctorController::class, 'store'])->name('administrator.doctors.store');
        Route::get('/edit/{id}', [AdminDoctorController::class, 'edit'])->name('administrator.doctors.edit');
        Route::put('/update/{id}', [AdminDoctorController::class, 'update'])->name('administrator.doctors.update');
        Route::delete('/delete/{id}', [AdminDoctorController::class, 'delete'])->name('administrator.doctors.delete');
    });

    Route::group(['prefix' => 'patient-categories'], function() {
        Route::get('/', [AdminPatientCategoryController::class, 'index'])->name('administrator.patient-categories');
        Route::get('/create', [AdminPatientCategoryController::class, 'create'])->name('administrator.patient-categories.create');
        Route::post('/store', [AdminPatientCategoryController::class, 'store'])->name('administrator.patient-categories.store');
        Route::get('/edit/{id}', [AdminPatientCategoryController::class, 'edit'])->name('administrator.patient-categories.edit');
        Route::put('/update/{id}', [AdminPatientCategoryController::class, 'update'])->name('administrator.patient-categories.update');
        Route::delete('/delete/{id}', [AdminPatientCategoryController::class, 'delete'])->name('administrator.patient-categories.delete');
    });
});

require __DIR__.'/auth.php';
