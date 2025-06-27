<?php

use App\Http\Controllers\Modules\ModuleController;

Route::middleware('auth')->group(function () {
    // Routes for normal users
    Route::prefix('modules')->group(function () {
        Route::get('/', [ModuleController::class, 'index'])->name('module.index');
        Route::get('/{slug}', [ModuleController::class, 'show'])->name('module.show');
    });

    // Routes for admin users
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::prefix('modules')->group(function () {
            Route::get('/', [ModuleController::class, 'adminIndex'])->name('admin.module.index');
            Route::post('/', [ModuleController::class, 'store'])->name('admin.module.store');
        });
    });
});