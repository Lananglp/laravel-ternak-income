<?php

use App\Http\Controllers\Role\RoleController;

Route::middleware('auth')->group(function () {
    Route::middleware('role:admin')->group(function () {
        Route::get('roles', [RoleController::class, 'index'])->name('role.index');
        Route::post('roles', [RoleController::class, 'store'])->name('role.store');
        Route::put('roles/{role}', [RoleController::class, 'update'])->name('role.update');
        Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('role.destroy');
    });
});