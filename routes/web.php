<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\Membership\MembershipController;
use App\Models\Membership;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'memberships' => Membership::with('benefits')->orderBy('position')->get()->makeHidden(['created_at', 'updated_at']),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // private !auth
    Route::get('/files/{filepath}', [FileController::class, 'show'])->where('filepath', '.*')->name('files.show');
    // private full
    Route::middleware('membership')->group(function () {
        Route::get('/private/images/{filepath}', [FileController::class, 'videoTumbnail'])->where('filepath', '.*')->name('videos.thumbnail');
        Route::get('/private/{filepath}', [FileController::class, 'video'])->where('filepath', '.*')->name('videos.stream');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/account.php';
require __DIR__.'/role.php';
require __DIR__.'/module.php';
require __DIR__.'/membership.php';
require __DIR__.'/transaction.php';
