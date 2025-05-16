<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Jenssegers\Agent\Agent;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */

    public function sessions(Request $request): \Inertia\Response
    {
        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) {
                $agent = new Agent();
                $agent->setUserAgent($session->user_agent);

                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'is_current_device' => $session->id === session()->getId(),
                    'browser' => $agent->browser(),
                    'platform' => $agent->platform(),
                    'device' => $agent->device(),
                    'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
                ];
            });

        return Inertia::render('settings/sessions', [
            'sessions' => $sessions,
        ]);
    }
    
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Handle pergantian username maksimal 14 hari sekali
        if ($user->username !== $validated['username']) {
            if ($user->username_changed_at && now()->diffInDays($user->username_changed_at) < 14) {
                return back()->withErrors([
                    'username' => 'You can only change your username every 14 days.',
                ]);
            }

            $user->username = $validated['username'];
            $user->username_changed_at = now();
        }

        // Reset email verification jika email diganti
        if ($user->email !== $validated['email']) {
            $user->email_verified_at = null;
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Hapus avatar lama jika ada
            if ($user->avatar) {
                $oldPath = str_replace(asset('storage') . '/', '', $user->avatar);
                Storage::disk('public')->delete($oldPath);
            }

            // Simpan avatar baru
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = asset('storage/' . $path);
        }

        // Update field lainnya
        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'bio' => $validated['bio'] ?? null,
            'phone_1' => $validated['phone_1'] ?? null,
            'phone_2' => $validated['phone_2'] ?? null,
            'url_1' => $validated['url_1'] ?? null,
            'url_2' => $validated['url_2'] ?? null,
        ]);

        $user->save();

        return to_route('profile.edit')->with('status', 'Profile updated.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function destroySession(string $id): RedirectResponse
    {
        $user = Auth::user();

        // Filter session milik user ini
        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', $id)
            ->delete();

        return back()->with('status', 'Session ended successfully.');
}

}
