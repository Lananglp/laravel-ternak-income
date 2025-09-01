<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Module;
use App\Models\ModuleVideo;
use App\Models\UserVideoProgress;
use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\X264;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Auth;

class ModuleVideoController extends Controller
{
    private string $disk;

    public function __construct()
    {
        $this->disk = config('filesystems.default', 'local');
    }

    public function show($slug, ModuleVideo $video)
    {
        $user = Auth::user();

        // Ambil semua video dan progress user di setiap video
        $module = Module::where('slug', $slug)
            ->with(['videos' => function ($query) use ($user) {
                $query->orderBy('position')
                    ->with(['userProgress' => function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    }]);
            }])
            ->firstOrFail();

        // Validasi video milik modul
        if ($video->module_id !== $module->id) {
            abort(404);
        }

        // Ambil progress video saat ini
        $progress = UserVideoProgress::where('user_id', $user->id)
            ->where('module_video_id', $video->id)
            ->first();

        // Hitung total durasi semua video dalam modul
        $totalDuration = $module->videos->sum('duration');

        // Hitung total video yang sudah selesai
        $completedCount = UserVideoProgress::where('user_id', $user->id)
            ->whereIn('module_video_id', $module->videos->pluck('id'))
            ->where('is_completed', true)
            ->count();

        $totalVideos = $module->videos->count();
        $progressPercentage = $totalVideos > 0 ? round(($completedCount / $totalVideos) * 100) : 0;

        return Inertia::render('modules/module_video/module-video', [
            'video' => $video,
            'module' => $module,
            'progress' => $progress ?? null,
            'totalDuration' => $totalDuration ?? 0,
            'moduleProgressPercentage' => $progressPercentage,
        ]);
    }

    public function create($slug)
    {
        $module = Module::where('slug', $slug)->firstOrFail();

        if (!$module) {
            abort(404);
        }

        return Inertia::render('modules/module_video/module-video-create', [
            'module' => $module
        ]);
    }

    public function store(Request $request, $slug)
    {
        $module = Module::where('slug', $slug)->firstOrFail();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'video' => 'required|file|mimes:mp4,mov,webm,avi,mkv|max:512000',
            'duration' => 'required|integer|min:1', // 🔹 durasi dari frontend
        ]);

        // Simpan thumbnail
        $thumbnail = $request->file('thumbnail');
        $thumbnailFilename = Str::uuid() . '.' . $thumbnail->getClientOriginalExtension();
        $thumbnailPath = "modules/videos/thumbnails/{$thumbnailFilename}";
        Storage::disk($this->disk)->putFileAs('modules/videos/thumbnails', $thumbnail, $thumbnailFilename);

        // Simpan video
        $video = $request->file('video');
        $videoFilename = Str::uuid() . '.' . $video->getClientOriginalExtension();
        $videoPath = "modules/videos/files/{$videoFilename}";
        Storage::disk($this->disk)->putFileAs('modules/videos/files', $video, $videoFilename);

        // Simpan ke database
        ModuleVideo::create([
            'module_id' => $module->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'thumbnail' => $thumbnailPath,
            'video_url' => $videoPath,
            'duration' => $data['duration'], // 🔹 dari frontend
        ]);

        return redirect()->route('module.show', $module->slug)->with('success', 'Video berhasil diunggah.');
    }

    public function update(Request $request, $slug, $id)
    {
        $module = Module::where('slug', $slug)->firstOrFail();
        $video = ModuleVideo::where('module_id', $module->id)->findOrFail($id);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Jika thumbnail baru diupload, simpan dan hapus yang lama
        if ($request->hasFile('thumbnail')) {
            // Hapus thumbnail lama
            if ($video->thumbnail && Storage::disk($this->disk)->exists($video->thumbnail)) {
                Storage::disk($this->disk)->delete($video->thumbnail);
            }

            $thumbnail = $request->file('thumbnail');
            $thumbnailFilename = Str::uuid() . '.' . $thumbnail->getClientOriginalExtension();
            $thumbnailPath = "modules/videos/thumbnails/{$thumbnailFilename}";
            Storage::disk($this->disk)->putFileAs('modules/videos/thumbnails', $thumbnail, $thumbnailFilename);

            $video->thumbnail = $thumbnailPath;
        }

        // Update field lain
        $video->title = $data['title'];
        $video->description = $data['description'] ?? null;

        $video->save();

        return redirect()->route('module.show', $module->slug)->with('success', 'Video berhasil diperbarui.');
    }

    public function destroy($slug, $id)
    {
        $module = Module::where('slug', $slug)->firstOrFail();
        $video = ModuleVideo::where('module_id', $module->id)->findOrFail($id);

        // Hapus thumbnail jika ada
        if ($video->thumbnail && Storage::disk($this->disk)->exists($video->thumbnail)) {
            Storage::disk($this->disk)->delete($video->thumbnail);
        }

        // Hapus file video jika ada
        if ($video->video_url && Storage::disk($this->disk)->exists($video->video_url)) {
            Storage::disk($this->disk)->delete($video->video_url);
        }

        $video->delete();

        return redirect()->back()->with('success', 'Video berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $order = $request->input('order');

        foreach ($order as $index => $id) {
            ModuleVideo::where('id', $id)->update(['position' => $index]);
        }

        return back()->with('success', 'Video diurutkan.');
    }
}
