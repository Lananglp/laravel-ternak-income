<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Membership\MembershipController;
use App\Models\Membership;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'memberships' => Membership::with('benefits')->orderBy('position')->get()->makeHidden(['created_at', 'updated_at']),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/account.php';
require __DIR__.'/role.php';
require __DIR__.'/module.php';
require __DIR__.'/membership.php';
