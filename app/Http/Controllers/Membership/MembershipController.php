<?php

namespace App\Http\Controllers\Membership;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Membership;
use App\Models\User;
use App\Models\Transaction;
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
use Illuminate\Support\Facades\Auth;

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

    public function info()
    {
        $memberActive = Auth::user()->load('membership');

        return Inertia::render('membership/membership-info', [
            'member' => $memberActive
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

        if (
            $user->membership_id &&
            $user->membership_expires_at &&
            $user->membership_expires_at->isFuture()
        ) {
            return redirect()->back()->with('error', 'Kamu masih memiliki membership aktif hingga ' . $user->membership_expires_at->translatedFormat('d F Y H:i') . '.');
        }

        // $orderId = 'ORDER-' . strtoupper(Str::random(10));
        $orderId = 'ORDER-' . now()->format('YmdHis') . '-' . strtoupper(Str::random(10));

        $payload = [
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
                ]
            ],
            'custom_field1' => $user->id,
            'custom_field2' => $membership->id
        ];

        $snapToken = Snap::getSnapToken($payload);

        // Kirim token ke frontend, simpan order_id di session jika perlu
        return redirect()->back()->with([
            'snap_token' => $snapToken,
            'order_id' => $orderId,
        ]);
    }

    public function callback(Request $request)
    {
        $notif = new Notification();

        // Ambil order_id dari notifikasi
        $orderId = $notif->order_id;

        // Cek apakah transaksi sudah ada
        $transaction = Transaction::where('order_id', $orderId)->first();
        $userId = $notif->custom_field1 ?? null;
        $membershipId = $notif->custom_field2 ?? null;

        if (!$transaction) {
            // ❗️Jika belum ada, maka buat baru di sini
            // Pastikan ada cara untuk mendapatkan user & membership (misalnya dari email atau custom metadata)
            $user = User::find($userId);
            $membership = Membership::find($membershipId);

            if (!$user || !$membership) {
                return response()->json(['message' => 'User or membership not found'], 404);
            }

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'membership_id' => $membership->id,
                'order_id' => $orderId,
                'transaction_id' => $notif->transaction_id,
                'payment_type' => $notif->payment_type,
                'transaction_status' => $notif->transaction_status,
                'fraud_status' => $notif->fraud_status,
                'response' => file_get_contents('php://input'),
                'paid_at' => in_array($notif->transaction_status, ['settlement', 'capture']) ? now() : null,
            ]);
        } else {
            // Jika sudah ada, update data-nya
            $transaction->update([
                'payment_type' => $notif->payment_type,
                'transaction_status' => $notif->transaction_status,
                'fraud_status' => $notif->fraud_status,
                'transaction_id' => $notif->transaction_id,
                'response' => file_get_contents('php://input'),
                'paid_at' => in_array($notif->transaction_status, ['settlement', 'capture']) ? now() : null,
            ]);
        }

        // Jika pembayaran sukses, aktifkan membership ke user
        if (in_array($notif->transaction_status, ['settlement', 'capture'])) {
            $duration = $transaction->membership->duration_days ?? null;
            $user = $transaction->user;

            $user->update([
                'membership_id' => $transaction->membership_id,
                'membership_started_at' => now(),
                'membership_expires_at' => $duration ? now()->addDays($duration) : null,
            ]);
        }

        return response()->json(['message' => 'Callback processed'], 200);
    }
}
