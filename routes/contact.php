<?php

use App\Http\Controllers\Contact\ContactController;

Route::middleware('auth')->group(function () {
    Route::get('/contact-us', [ContactController::class, 'create'])->name('contact.create');
    Route::post('/contact-us', [ContactController::class, 'store'])->name('contact.store');

    Route::middleware('role:admin')->group(function () {
        Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
        Route::patch('/contact/{contact}/read', [ContactController::class, 'markAsRead'])->name('contact.read');
    });
});