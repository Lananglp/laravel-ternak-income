<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Module;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = Module::withCount('videos')->orderBy('position')->get();

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
            'thumbnail' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Pastikan fungsi ini ada di controller Anda atau di sebuah Trait
        $slug = $this->generateUniqueSlug($data['title']); 

        // Proses dan kompres thumbnail jadi .webp
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');

            $image = Image::read($thumbnail)->orient();

            // Cek rasio 16:9
            $width = $image->width();
            $height = $image->height();
            $ratio = $width / $height;
            $expected = 16 / 9;

            if (abs($ratio - $expected) > 0.05) {
                return redirect()->back()->withErrors(['thumbnail' => 'Thumbnail harus memiliki rasio 16:9.']);
            }
            
            // Menggunakan facade Image yang sudah diimpor
            $resized = $image
            ->resize(1280, 720, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })
            ->toWebp(70);

            // Generate nama unik
            $filename = Str::uuid() . '.webp';

            // Simpan ke storage/app/public/modules/thumbnails
            Storage::disk('local')->put("modules/thumbnails/{$filename}", (string) $resized);
            
            // Simpan path lengkap di database
            $thumbnailPath = "modules/thumbnails/{$filename}";
        }


        $module = Module::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'slug' => $slug,
            'thumbnail' => $thumbnailPath ?? null, // Gunakan path yang sudah disimpan
        ]);

        return redirect()->back()->with('success', 'Modul berhasil ditambahkan.');
    }

    public function update(Request $request, Module $module)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Cek jika judul diubah, maka ubah slug
        if ($module->title !== $data['title']) {
            $slug = $this->generateUniqueSlug($data['title']);
            $module->slug = $slug;
        }

        // Proses jika thumbnail baru diupload
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $image = Image::read($thumbnail)->orient();

            $width = $image->width();
            $height = $image->height();
            $ratio = $width / $height;
            $expected = 16 / 9;

            if (abs($ratio - $expected) > 0.05) {
                return redirect()->back()->withErrors(['thumbnail' => 'Thumbnail harus memiliki rasio 16:9.']);
            }

            $resized = $image
                ->resize(1280, 720, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                })
                ->toWebp(70);

            $filename = Str::uuid() . '.webp';
            $path = "modules/thumbnails/{$filename}";
            Storage::disk('local')->put($path, (string) $resized);

            // Hapus thumbnail lama jika ada
            if ($module->thumbnail && Storage::disk('local')->exists($module->thumbnail)) {
                Storage::disk('local')->delete($module->thumbnail);
            }

            $module->thumbnail = $path;
        }

        $module->title = $data['title'];
        $module->description = $data['description'];
        $module->save();

        return redirect()->back()->with('success', 'Modul berhasil diperbarui.');
    }

    public function destroy(Module $module)
    {
        // Hapus thumbnail dari storage jika ada
        if ($module->thumbnail && Storage::disk('local')->exists($module->thumbnail)) {
            Storage::disk('local')->delete($module->thumbnail);
        }

        $module->delete();

        return redirect()->back()->with('success', 'Modul berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $order = $request->input('order'); // [3, 1, 2, 4]

        foreach ($order as $index => $id) {
            Module::where('id', $id)->update(['position' => $index]);
        }

        return back()->with('success', 'Modul diurutkan.');
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