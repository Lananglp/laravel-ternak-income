<?php

use App\Http\Controllers\Modules\ModuleController;

Route::middleware('auth')->group(function () {
    // Routes for normal users
    Route::prefix('modules')->group(function () {
        Route::get('/', [ModuleController::class, 'index'])->name('module.index');
        Route::get('/{slug}', [ModuleController::class, 'show'])->name('module.show');

        Route::middleware('role:admin')->group(function () {
            Route::post('/', [ModuleController::class, 'store'])->name('module.store');
            Route::post('/{module}', [ModuleController::class, 'update'])->name('module.update');
            Route::delete('/{module}', [ModuleController::class, 'destroy'])->name('module.destroy');
            Route::post('/x/reorder', [ModuleController::class, 'reorder'])->name('module.reorder');
        });
    });

    // Routes for admin users
    // Route::prefix('admin')->middleware('role:admin')->group(function () {
    //     Route::prefix('modules')->group(function () {
    //         // Route::get('/', [ModuleController::class, 'adminIndex'])->name('admin.module.index');
            
    //     });
    // });
});