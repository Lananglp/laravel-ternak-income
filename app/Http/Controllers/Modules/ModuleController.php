<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Module;
use Illuminate\Support\Str;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = Module::withCount('videos')->get();

        return Inertia::render('modules/module', [
            'modules' => $modules
        ]);
    }

    public function adminIndex()
    {
        $modules = Module::withCount('videos')->get();

        return Inertia::render('modules/admin/admin-module', [
            'modules' => $modules
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|url',
        ]);

        $data['slug'] = $this->generateUniqueSlug($data['title']);

        $module = Module::create($data);

        return back()->with('success', 'Modul baru ditambahkan.');
    }

    public function show($slug)
    {
        $module = Module::with(['videos' => function ($query) {
            $query->orderBy('position');
        }])->where('slug', $slug)->firstOrFail();

        return Inertia::render('modules/module-show', [
            'module' => $module
        ]);
    }

    private function generateUniqueSlug(string $title): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (Module::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        return $slug;
    }
}