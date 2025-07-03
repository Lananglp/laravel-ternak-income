<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Models\Membership;

class DashboardController extends Controller
{
    public function index()
    {
        // $now = now();

        // // Semua transaksi sukses (settlement atau capture)
        // $query = Transaction::whereIn('transaction_status', ['settlement', 'capture']);

        // // Total semua transaksi
        // $totalTransaction = (clone $query)->sum(DB::raw('CAST(JSON_UNQUOTE(JSON_EXTRACT(response, "$.gross_amount")) AS UNSIGNED)'));

        // // Hari ini
        // $todayTransaction = (clone $query)->whereDate('paid_at', Carbon::today())->sum(DB::raw('CAST(JSON_UNQUOTE(JSON_EXTRACT(response, "$.gross_amount")) AS UNSIGNED)'));

        // // Kemarin
        // $yesterdayTransaction = (clone $query)->whereDate('paid_at', Carbon::yesterday())->sum(DB::raw('CAST(JSON_UNQUOTE(JSON_EXTRACT(response, "$.gross_amount")) AS UNSIGNED)'));

        // // Minggu ini (Senin s/d hari ini)
        // $thisWeekTransaction = (clone $query)
        //     ->whereBetween('paid_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
        //     ->sum(DB::raw('CAST(JSON_UNQUOTE(JSON_EXTRACT(response, "$.gross_amount")) AS UNSIGNED)'));

        // // Minggu lalu
        // $lastWeekTransaction = (clone $query)
        //     ->whereBetween('paid_at', [
        //         Carbon::now()->subWeek()->startOfWeek(),
        //         Carbon::now()->subWeek()->endOfWeek()
        //     ])
        //     ->sum(DB::raw('CAST(JSON_UNQUOTE(JSON_EXTRACT(response, "$.gross_amount")) AS UNSIGNED)'));

        // // Bulan ini
        // $thisMonthTransaction = (clone $query)
        //     ->whereBetween('paid_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])
        //     ->sum(DB::raw('CAST(JSON_UNQUOTE(JSON_EXTRACT(response, "$.gross_amount")) AS UNSIGNED)'));

        // // Bulan lalu
        // $lastMonthTransaction = (clone $query)
        //     ->whereBetween('paid_at', [
        //         $now->copy()->subMonth()->startOfMonth(),
        //         $now->copy()->subMonth()->endOfMonth()
        //     ])
        //     ->sum(DB::raw('CAST(JSON_UNQUOTE(JSON_EXTRACT(response, "$.gross_amount")) AS UNSIGNED)'));

        // // membership
        // $memberships = Membership::all();

        return Inertia::render('dashboard', [
            // 'totalTransaction'      => $totalTransaction,
            // 'todayTransaction'      => $todayTransaction,
            // 'yesterdayTransaction'  => $yesterdayTransaction,
            // 'thisWeekTransaction'   => $thisWeekTransaction,
            // 'lastWeekTransaction'   => $lastWeekTransaction,
            // 'thisMonthTransaction'  => $thisMonthTransaction,
            // 'lastMonthTransaction'  => $lastMonthTransaction,
            // 'memberships'           => $memberships
        ]);
    }
}
