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

        if (!$module) {
            return redirect()->back()->with('error', 'Modul tidak ditemukan, pastikan modul tersedia.');
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'thumbnail' => 'required|image|mimes:jpg,jpeg,png|max:2048', // max 2MB
            'video' => 'required|file|mimes:mp4,mov,webm,avi,mkv|max:512000', // max 500MB
        ]);

        // 🔹 Simpan thumbnail
        $thumbnail = $request->file('thumbnail');
        $image = Image::read($thumbnail)->orient();

        // Rasio 16:9 check
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

        $thumbnailFilename = Str::uuid() . '.webp';
        $thumbnailPath = "modules/videos/thumbnails/{$thumbnailFilename}";
        Storage::disk($this->disk)->put($thumbnailPath, (string) $resized);

        // 🔹 Simpan video
        $video = $request->file('video');
        $videoFilename = Str::uuid() . '.' . $video->getClientOriginalExtension();
        $videoPath = "modules/videos/files/{$videoFilename}";
        Storage::disk($this->disk)->putFileAs('modules/videos/files', $video, $videoFilename);

        // 🔹 Hitung durasi video dengan FFMpeg
        $ffmpeg = FFMpeg::create();
        $videoFFM = $ffmpeg->open(Storage::disk($this->disk)->path($videoPath));
        $ffprobe = \FFMpeg\FFProbe::create();
        $duration = (int) $ffprobe
            ->format(Storage::disk($this->disk)->path($videoPath))
            ->get('duration');

        // 🔹 Simpan ke database
        ModuleVideo::create([
            'module_id' => $module->id,
            'title' => $data['title'],
            'description' => $data['description'],
            'thumbnail' => $thumbnailPath,
            'video_url' => $videoPath,
            'duration' => $duration,
        ]);

        return redirect()->route('module.show', $module->slug)->with('success', 'Video berhasil ditambahkan.');
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
