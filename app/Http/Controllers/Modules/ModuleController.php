<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Module;
use App\Models\UserVideoProgress;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ModuleController extends Controller
{
    private string $disk;

    public function __construct()
    {
        $this->disk = config('filesystems.default', 'local');
    }

    public function index()
    {
        $user = auth()->user();

        $modules = Module::with([
            'videos' => function ($query) {
                $query->orderBy('position');
            },
            'videos.userProgress' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }
        ])
        ->orderBy('position')
        ->get();

        // Hitung progress dan total durasi per modul
        $modules = $modules->map(function ($module) use ($user) {
            $totalVideos = $module->videos->count();

            $completedCount = $module->videos->filter(function ($video) {
                return $video->userProgress && $video->userProgress->is_completed;
            })->count();

            $totalDuration = $module->videos->sum('duration');

            $progressPercentage = $totalVideos > 0
                ? round(($completedCount / $totalVideos) * 100)
                : 0;

            return [
                ...$module->toArray(),
                'progress_percentage' => $progressPercentage,
                'total_duration' => $totalDuration,
                'total_videos_count' => $totalVideos,
            ];
        });

        return Inertia::render('modules/module', [
            'modules' => $modules
        ]);
    }

    public function show($slug)
    {
        $user = Auth::user();

        $module = Module::where('slug', $slug)
            ->with(['videos' => function ($query) use ($user) {
                $query->orderBy('position')
                    ->with(['userProgress' => function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    }]);
            }])
            ->firstOrFail();

        // Hitung total durasi semua video dalam modul
        $totalDuration = $module->videos->sum('duration');

        // Hitung total video yang sudah selesai
        $completedCount = UserVideoProgress::where('user_id', $user->id)
            ->whereIn('module_video_id', $module->videos->pluck('id'))
            ->where('is_completed', true)
            ->count();

        $totalVideos = $module->videos->count();
        $progressPercentage = $totalVideos > 0 ? round(($completedCount / $totalVideos) * 100) : 0;

        return Inertia::render('modules/module-show', [
            'module' => $module,
            'totalDuration' => $totalDuration ?? 0,
            'moduleProgressPercentage' => $progressPercentage,
        ]);
    }

    // public function adminIndex()
    // {
    //     $modules = Module::withCount('videos')->get();

    //     return Inertia::render('modules/admin/admin-module', [
    //         'modules' => $modules
    //     ]);
    // }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $slug = $this->generateUniqueSlug($data['title']); 

        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $image = Image::read($thumbnail)->orient();

            $width = $image->width();
            $height = $image->height();
            $ratio = $width / $height;
            $expected = 16 / 9;

            if (abs($ratio - $expected) > 0.5) {
                return redirect()->back()->withErrors(['thumbnail' => 'Thumbnail harus memiliki rasio 16:9.']);
            }

            $resized = $image
                ->resize(1280, 720, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                })
                ->toWebp(70);

            $filename = Str::uuid() . '.webp';
            $thumbnailPath = "modules/thumbnails/{$filename}";

            Storage::disk($this->disk)->put($thumbnailPath, (string) $resized);
        }

        Module::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'slug' => $slug,
            'thumbnail' => $thumbnailPath ?? null,
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

        if ($module->title !== $data['title']) {
            $module->slug = $this->generateUniqueSlug($data['title']);
        }

        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $image = Image::read($thumbnail)->orient();

            $width = $image->width();
            $height = $image->height();
            $ratio = $width / $height;
            $expected = 16 / 9;

            if (abs($ratio - $expected) > 0.5) {
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
            Storage::disk($this->disk)->put($path, (string) $resized);

            if ($module->thumbnail && Storage::disk($this->disk)->exists($module->thumbnail)) {
                Storage::disk($this->disk)->delete($module->thumbnail);
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
        if ($module->thumbnail && Storage::disk($this->disk)->exists($module->thumbnail)) {
            Storage::disk($this->disk)->delete($module->thumbnail);
        }

        $module->delete();

        return redirect()->back()->with('success', 'Modul berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $order = $request->input('order');

        foreach ($order as $index => $id) {
            Module::where('id', $id)->update(['position' => $index]);
        }

        return back()->with('success', 'Modul diurutkan.');
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
