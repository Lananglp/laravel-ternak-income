<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class AccountController extends Controller
{
    public function index(): Response
    {
        $user = User::latest()->get();
        $user->makeHidden(['password', 'remember_token', 'email_verified_at']);

        return Inertia::render('account/account', [
            'users' => $user,
        ]);
    }
}
