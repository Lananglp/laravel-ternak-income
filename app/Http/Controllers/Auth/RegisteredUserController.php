<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Buat username dari nama
        $username = $this->generateUsername($request->name);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $username,
            'password' => Hash::make($request->password),
            'provider' => 'none', // karena register manual
            // Field lain biarkan null (bio, avatar, phone, url, etc.)
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }

    private function generateUsername(string $name): string
    {
        // Ubah ke lowercase
        $lower = strtolower($name);

        // Hapus semua karakter kecuali huruf, angka, dan underscore
        $clean = preg_replace('/[^a-z0-9_]/', '', $lower);

        // Potong ke max 30 karakter jika terlalu panjang
        $clean = substr($clean, 0, 30);

        $original = $clean;
        $i = 1;

        // Pastikan username unik
        while (User::where('username', $clean)->exists()) {
            $suffix = (string)$i++;
            $cutLength = 30 - strlen($suffix); // jaga agar tetap maksimal 30 karakter
            $clean = substr($original, 0, $cutLength) . $suffix;
        }

        return $clean;
    }
}
