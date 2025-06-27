<?php

use App\Http\Controllers\Transaction\TransactionController;

Route::middleware('auth')->group(function () {
    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
    // Route::post('transactions', [TransactionController::class, 'store'])->name('account.store');
    // Route::put('transactions/{user}', [TransactionController::class, 'update'])->name('account.update');
    // Route::delete('transactions/{user}', [TransactionController::class, 'destroy'])->name('account.destroy');
    // Route::put('/users/{user}/set-role', [TransactionController::class, 'setRole'])->name('account.set-role');
});