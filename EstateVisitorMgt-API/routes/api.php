<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AppUserController;
use App\Http\Controllers\AuthController;

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::put('/{category}', [CategoryController::class, 'update']);
    Route::delete('/{category}', [CategoryController::class, 'destroy']);
});

Route::prefix('appusers')->group(function () {
    Route::get('/', [AppUserController::class, 'index']);
    Route::post('/', [AppUserController::class, 'store']);
    Route::put('/{appuser}', [AppUserController::class, 'update']);
    Route::delete('/{appuser}', [AppUserController::class, 'destroy']);
});



Route::post('/login', [AuthController::class, 'login']);
