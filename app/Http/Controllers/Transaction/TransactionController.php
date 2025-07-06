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

    public function show(string $orderId)
    {
        $user = auth()->user();

        $transaction = Transaction::with(['user', 'membership'])
            ->where('order_id', $orderId)
            ->firstOrFail();

        // Jika user bukan pemilik transaksi dan bukan admin, beri 403
        if ($transaction->user_id !== $user->id && $user->role->slug !== 'admin') {
            abort(403, 'Anda tidak memiliki akses untuk melihat transaksi ini.');
        }

        return Inertia::render('transactions/transaction-show', [
            'transaction' => $transaction,
        ]);
    }
}
