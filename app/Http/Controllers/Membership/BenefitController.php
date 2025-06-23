<?php

namespace App\Http\Controllers\Membership;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Membership;
use App\Models\MembershipBenefit;

class BenefitController extends Controller
{
    public function store(Request $request, Membership $membership)
    {
        $validated = $request->validate([
            'benefit' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $membership->benefits()->create([
            'benefit' => $validated['benefit'],
            'is_active' => $validated['is_active'],
        ]);

        return back()->with('success', 'Benefit ditambahkan.');
    }

    public function update(Request $request, Membership $membership, MembershipBenefit $benefit)
    {
        $request->validate([
            'benefit' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $benefit->update($request->only(['benefit', 'is_active']));

        return back()->with('success', 'Benefit diperbarui.');
    }

    public function destroy(Membership $membership, MembershipBenefit $benefit)
    {
        $benefit->delete();

        return back()->with('success', 'Benefit dihapus.');
    }

    public function reorder(Request $request, Membership $membership)
    {
        foreach ($request->input('order') as $index => $id) {
            MembershipBenefit::where('id', $id)->update(['position' => $index]);
        }

        return back()->with('success', 'Benefit diurutkan.');
    }
}
