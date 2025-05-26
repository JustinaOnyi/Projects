<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AppUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EstateGateController;
use App\Http\Controllers\AccessGateController;
use App\Http\Controllers\MacDeviceController;
use App\Http\Controllers\AccessCodeController;
use App\Http\Controllers\VisitorAccessCodeController;
use App\Http\Controllers\AccessCodeValidationController;
use App\Http\Controllers\EstateController;

Route::get('/estates', [EstateController::class, 'index']);
Route::post('/estates', [EstateController::class, 'store']);
Route::put('/estates/{id}', [EstateController::class, 'update']);
Route::delete('/estates/{id}', [EstateController::class, 'destroy']);
Route::post('/validate-code', [AccessCodeValidationController::class, 'validateCode']);


Route::get('/visitor-access-codes', [VisitorAccessCodeController::class, 'index']);
Route::post('/visitor-access-codes', [VisitorAccessCodeController::class, 'store']);
Route::put('/visitor-access-codes/{id}', [VisitorAccessCodeController::class, 'update']);
Route::put('/visitor-access-codes/{id}/used', [VisitorAccessCodeController::class, 'markAsUsed']);


Route::get('/access-codes/users', [AccessCodeController::class, 'getPrincipalUsers']);
Route::post('/access-codes', [AccessCodeController::class, 'store']);
Route::put('/access-codes/{id}', [AccessCodeController::class, 'update']);
Route::get('/access-codes', [AccessCodeController::class, 'listCodes']);
Route::get('/access-codes/users/dependants', [AccessCodeController::class, 'getDependantsForPrincipalUser']);

Route::get('/users', [AppUserController::class, 'index']);
Route::post('/users', [AppUserController::class, 'store']);
Route::put('/users/{id}', [AppUserController::class, 'update']);
Route::delete('/users/{id}', [AppUserController::class, 'destroy']);

Route::get('/states', [EstateGateController::class, 'getStates']);
Route::get('/locations/{state_id}', [EstateGateController::class, 'getLocationsByState']);
Route::get('/streets/{location_id}', [EstateGateController::class, 'getStreetsByLocation']);
Route::get('/streets', [EstateGateController::class, 'getStreets']);
Route::post('/street', [EstateGateController::class, 'storeStreet']);
Route::put('/street/{id}', [EstateGateController::class, 'updateStreet']);
Route::delete('/street/{id}', [EstateGateController::class, 'deleteStreet']);

Route::get('/access-gates', [AccessGateController::class, 'index']);
Route::post('/access-gate', [AccessGateController::class, 'store']);
Route::put('/access-gate/{id}', [AccessGateController::class, 'update']);
Route::delete('/access-gate/{id}', [AccessGateController::class, 'destroy']);
//Route::get('/distinct-streets', [AccessGateController::class, 'getDistinctStreets']);

Route::get('/mac-devices', [MacDeviceController::class, 'index']);
Route::post('/mac-devices', [MacDeviceController::class, 'store']);
Route::put('/mac-devices/{id}', [MacDeviceController::class, 'update']);
Route::delete('/mac-devices/{id}', [MacDeviceController::class, 'destroy']);

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::put('/{category}', [CategoryController::class, 'update']);
    Route::delete('/{category}', [CategoryController::class, 'destroy']);
});

// Route::prefix('appusers')->group(function () {
//     Route::get('/', [AppUserController::class, 'index']);
//     Route::post('/', [AppUserController::class, 'store']);
//     Route::put('/{appuser}', [AppUserController::class, 'update']);
//     Route::delete('/{appuser}', [AppUserController::class, 'destroy']);
// });



Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-superadmin', [AuthController::class, 'registerSuperAdmin']);

