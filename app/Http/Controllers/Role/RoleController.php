<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('role/role', [
            // 'roles' => Role::latest()->get()->makeHidden(['created_at', 'updated_at']),
            'roles' => Role::latest()->get(),
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'slug' => [
                'required',
                'string',
                'unique:roles,slug',
                'regex:/^[a-z]+(-[a-z]+)*$/'
            ],
        ], [
            // 'slug.regex' => 'Slug hanya boleh huruf kecil dan tanda hubung (-), contoh: super-admin',
            'slug.regex' => 'Slug only allows lowercase letters and hyphens (-), example: super-admin',
        ]);

        $validated['slug'] = strtolower($validated['slug']);

        Role::create($validated);

        return redirect()->back()->with('success', 'Successfully created role.');
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
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'slug' => [
                'required',
                'string',
                'unique:roles,slug,' . $role->id,
                'regex:/^[a-z]+(-[a-z]+)*$/'
            ],
        ], [
            'slug.regex' => 'Slug only allows lowercase letters and hyphens (-), example: super-admin',
        ]);

        $validated['slug'] = strtolower($validated['slug']);

        $role->update($validated);

        return back()->with('success', 'Successfully updated role.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->back()->with('success', 'Successfully deleted role.');
    }
}
