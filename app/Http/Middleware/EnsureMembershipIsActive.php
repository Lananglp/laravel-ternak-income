<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class EnsureMembershipIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
         $user = Auth::user()->loadMissing('role');

        // Jika tidak ada user atau belum login
        if (!$user) {
            return redirect()->route('login');
        }

        // Jika user memiliki role admin
        if ($user->role->slug === 'admin') {
            return $next($request);
        }

        // Jika user tidak memiliki membership
        // if (!$user->membership_id || !$user->membership_expires_at) {
        if (!$user->membership_started_at) {
            return redirect()->route('membership.index')->with('error', 'Anda belum memiliki membership aktif.');
        }

        // Jika membership sudah kadaluarsa
        if (Carbon::parse($user->membership_expires_at)->isPast()) {
            return redirect()->route('membership.index')->with('error', 'Membership Anda sudah kadaluarsa.');
        }

        return $next($request);
    }
}
