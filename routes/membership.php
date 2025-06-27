<?php

use App\Http\Controllers\Membership\MembershipController;
use App\Http\Controllers\Membership\BenefitController;

Route::post('/membership/callback', [MembershipController::class, 'callback'])->name('membership.callback');

Route::middleware('auth')->group(function () {
    Route::get('membership', [MembershipController::class, 'index'])->name('membership.index');
    Route::post('/membership/pay/{id}', [MembershipController::class, 'pay'])->name('membership.pay');
    // Route::post('/membership/callback', [MembershipController::class, 'callback'])->name('membership.callback');
    
    Route::middleware('role:admin')->group(function () {
        Route::post('/membership', [MembershipController::class, 'store'])->name('membership.store');
        Route::put('/membership/{id}', [MembershipController::class, 'update'])->name('membership.update');
        Route::delete('/membership/{id}', [MembershipController::class, 'destroy'])->name('membership.destroy');
        Route::post('/membership/reorder', [MembershipController::class, 'reorder'])->name('membership.reorder');

        Route::prefix('memberships/{membership}/benefits')->name('benefits.')->group(function () {
            Route::post('/', [BenefitController::class, 'store'])->name('store');
            Route::put('/{benefit}', [BenefitController::class, 'update'])->name('update');
            Route::delete('/{benefit}', [BenefitController::class, 'destroy'])->name('destroy');
            Route::post('/reorder', [BenefitController::class, 'reorder'])->name('reorder');
        });
    });
});