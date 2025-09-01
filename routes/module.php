<?php

use App\Http\Controllers\Modules\ModuleController;
use App\Http\Controllers\Modules\ModuleVideoController;
use App\Http\Controllers\Modules\VideoProgressController;

Route::middleware('auth')->group(function () {
    // Routes for normal users
    Route::prefix('modules')->group(function () {
        Route::get('/', [ModuleController::class, 'index'])->name('module.index');
        
        Route::middleware('membership')->group(function () {
            Route::get('/{slug}', [ModuleController::class, 'show'])->name('module.show');
            Route::get('/{slug}/video/{video}', [ModuleVideoController::class, 'show'])->name('module.video.show');
        });

        Route::post('/video-progress', [VideoProgressController::class, 'update'])->name('video.progress.update');

        Route::middleware('role:admin')->group(function () {
            Route::post('/', [ModuleController::class, 'store'])->name('module.store');
            Route::post('/{module}', [ModuleController::class, 'update'])->name('module.update');
            Route::delete('/{module}', [ModuleController::class, 'destroy'])->name('module.destroy');

            Route::post('/module/reorder', [ModuleController::class, 'reorder'])->name('module.reorder');
            Route::post('/{slug}/module/reorder', [ModuleVideoController::class, 'reorder'])->name('module.video.reorder');

            Route::get('/{slug}/create', [ModuleVideoController::class, 'create'])->name('module.video.create');
            Route::post('/{slug}/create', [ModuleVideoController::class, 'store'])->name('module.video.store');
            Route::post('/{slug}/edit/{id}', [ModuleVideoController::class, 'update'])->name('module.video.update');
            Route::delete('/{slug}/delete/{id}', [ModuleVideoController::class, 'destroy'])->name('module.video.destroy');
        });
    });
});