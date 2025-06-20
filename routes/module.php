<?php

use App\Http\Controllers\Module\ModuleController;

Route::middleware('auth')->group(function () {
    Route::get('modules', [ModuleController::class, 'index'])->name('module.index');
    Route::get('modules/show/{id}', [ModuleController::class, 'show'])->name('module.show');
});