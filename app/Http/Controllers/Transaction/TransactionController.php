<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        return Inertia::render('transactions/transaction', [
            'transactions' => Transaction::with(['user', 'membership'])
                ->latest()
                ->get()
                // ->makeHidden(['created_at', 'updated_at']),
        ]);
    }
}
