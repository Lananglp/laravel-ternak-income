<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SystemConfigController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/sessions', [ProfileController::class, 'sessions'])->name('profile.sessions');
    Route::delete('/settings/sessions/{id}', [ProfileController::class, 'destroySession'])->name('sessions.destroy');

    Route::get('settings/system', [SystemConfigController::class, 'edit'])->name('system.edit');
    Route::put('settings/system', [SystemConfigController::class, 'update'])->name('system.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::post('/upload/avatar', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'file' => ['required', 'image', 'max:2048'],
        ]);

        $path = $request->file('file')->store('avatars', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    });
});
