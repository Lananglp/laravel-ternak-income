<?php

use App\Http\Controllers\Account\AccountController;

Route::middleware('auth')->group(function () {
    Route::get('accounts', [AccountController::class, 'index'])->name('account');
});