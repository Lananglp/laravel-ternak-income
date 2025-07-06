<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ModuleVideo;
use App\Models\UserVideoProgress;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VideoProgressController extends Controller
{
    public function update(Request $request)
    {
        $data = $request->validate([
            'video_id' => 'required|exists:module_videos,id',
            'watched_seconds' => 'required|integer|min:0',
            'is_completed' => 'boolean',
        ]);

        $user = Auth::user();
        $videoId = $data['video_id'];
        $newWatched = $data['watched_seconds'];
        $isCompletedNow = $data['is_completed'] ?? false;

        $progress = UserVideoProgress::where('user_id', $user->id)
            ->where('module_video_id', $videoId)
            ->first();

        if ($progress) {
            // Jangan update jika user menonton lebih mundur dari sebelumnya
            if ($newWatched < $progress->watched_seconds) {
                return response()->json([
                    'message' => 'Skip update, watched time is behind previous progress',
                ]);
            }

            // Jangan update lagi kalau sudah selesai sebelumnya
            if ($progress->is_completed) {
                return response()->json([
                    'message' => 'Video already completed',
                ]);
            }

            // Update dengan watched_seconds terbaru dan mungkin is_completed
            $progress->update([
                'watched_seconds' => $newWatched,
                'is_completed' => $isCompletedNow || $progress->is_completed,
                'watched_at' => now(),
            ]);
        } else {
            // Belum pernah ada progress, buat baru
            UserVideoProgress::create([
                'user_id' => $user->id,
                'module_video_id' => $videoId,
                'watched_seconds' => $newWatched,
                'is_completed' => $isCompletedNow,
                'watched_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Progress saved',
        ]);
    }
}
