<?php

use App\Http\Controllers\Account\AccountController;

Route::middleware('auth')->group(function () {
    Route::middleware('role:admin')->group(function () {
        Route::get('accounts', [AccountController::class, 'index'])->name('account.index');
        Route::post('accounts', [AccountController::class, 'store'])->name('account.store');
        Route::put('accounts/{user}', [AccountController::class, 'update'])->name('account.update');
        Route::delete('accounts/{user}', [AccountController::class, 'destroy'])->name('account.destroy');
        Route::put('/users/{user}/set-role', [AccountController::class, 'setRole'])->name('account.set-role');
    });
});