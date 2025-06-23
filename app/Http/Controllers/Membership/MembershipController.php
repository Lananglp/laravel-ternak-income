<?php

namespace App\Http\Controllers\Membership;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Membership;
use App\Models\User;
use App\Http\Requests\Memberships\StoreMembershipRequest;
use App\Http\Requests\Memberships\UpdateMembershipRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Midtrans\Snap;
use Midtrans\Config;
use Midtrans\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MembershipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('membership/membership', [
            'memberships' => Membership::with('benefits')->orderBy('position')->get()->makeHidden(['created_at', 'updated_at']),
            // 'memberships' => Membership::latest()->get(),
            // 'can' => [
            //     'createMembership' => auth()->user()->can('create', Membership::class),
            //     'updateMembership' => auth()->user()->can('update', Membership::class),
            //     'deleteMembership' => auth()->user()->can('delete', Membership::class),
            // ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMembershipRequest $request): RedirectResponse
    {
        Membership::create($request->validated());

        return back()->with('success', 'Membership baru ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMembershipRequest $request, Membership $id)
    {
        $id->update($request->validated());

        return back()->with('success', 'Membership diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Membership $id)
    {
        $id->delete();

        return back()->with('success', 'Membership dihapus.');
    }

    public function reorder(Request $request)
    {
        $order = $request->input('order'); // [3, 1, 2, 4]

        foreach ($order as $index => $id) {
            Membership::where('id', $id)->update(['position' => $index]);
        }

        return back()->with('success', 'Membership diurutkan.');
    }

    public function pay(Request $request, $id)
    {
        $user = auth()->user();
        $membership = Membership::findOrFail($id);

        // Konfigurasi Midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $orderId = 'ORD-' . $user->id . '-' . $membership->id . '-' . Str::uuid();

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $membership->price,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
            ],
            'item_details' => [
                [
                    'id' => $membership->id,
                    'price' => $membership->price,
                    'quantity' => 1,
                    'name' => $membership->name,
                ],
            ],
        ];

        $snapToken = Snap::getSnapToken($params);
        // dd($snapToken);
        return redirect()->back()->with('snap_token', $snapToken);

        // try {
        //     $snapToken = Snap::getSnapToken($params);

        //     return redirect()->back()->with('snap_token', $snapToken);
        // } catch (\Exception $e) {
        //     return redirect()->back()->withErrors(['midtrans' => 'Gagal membuat token pembayaran: ' . $e->getMessage()]);
        // }
    }

    public function callback(Request $request)
    {
        // Set Midtrans Config
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');

        // Tangkap notifikasi
        $notification = new Notification();

        $transactionStatus = $notification->transaction_status;
        $paymentType = $notification->payment_type;
        $orderId = $notification->order_id;
        $fraudStatus = $notification->fraud_status;

        // Kamu bisa parse order_id, misalnya bentuknya "ORDER-uuid-USERID-MEMBERID"
        // atau kamu bisa simpan order_id dan mapping-nya ke tabel transaksi
        // Contoh ini hanya menunjukkan cara menyimpan membership

        if ($transactionStatus === 'capture' || $transactionStatus === 'settlement') {
            // Ambil user_id dan membership_id dari metadata (kalau kamu kirim sebelumnya)
            $userId = $notification->metadata->user_id ?? null;
            $membershipId = $notification->metadata->membership_id ?? null;

            if ($userId && $membershipId) {
                $user = User::find($userId);
                $membership = Membership::find($membershipId);

                if ($user && $membership) {
                    $user->membership_id = $membership->id;
                    if ($membership->duration_days) {
                        $user->membership_expires_at = now()->addDays($membership->duration_days);
                    } else {
                        $user->membership_expires_at = null; // Lifetime
                    }
                    $user->save();
                }
            }
        }

        return back()->with('success', 'Pembayaran berhasil.');
    }

}
