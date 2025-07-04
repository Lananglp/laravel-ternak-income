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

    public function show( string $orderId )
    {
        $transaction = Transaction::with(['user', 'membership'])->where('order_id', $orderId)->first();

        if (!$transaction) {
            abort(404);
        }

        return Inertia::render('transactions/transaction-show', [
            'transaction' => $transaction
        ]);
    }
}
