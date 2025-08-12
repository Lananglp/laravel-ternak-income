<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\Role;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // Cari role 'user'
        $role = Role::where('slug', 'user')->firstOrFail();

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'username' => $this->generateUsername($googleUser->getName()),
                'avatar' => $googleUser->getAvatar(),
                'provider' => 'google',
                'email_verified_at' => now(),
                'role_id' => $role->id,
            ]
        );

        Auth::login($user);

        // return redirect()->route('module.index', absolute: false);
        return to_route('module.index')->with('status', ' Selamat datang, ' . $user->name);
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
