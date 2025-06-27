<?php

namespace App\Http\Controllers\Modules;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ModuleVideo;
use App\Models\UserVideoProgress;

class VideoProgressController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'video_id' => 'required|exists:module_videos,id',
            'watched_seconds' => 'required|integer|min:0',
        ]);

        $video = ModuleVideo::find($data['video_id']);
        $userId = auth()->id();

        $progress = UserVideoProgress::updateOrCreate(
            ['user_id' => $userId, 'module_video_id' => $video->id],
            [
                'watched_seconds' => $data['watched_seconds'],
                'is_completed' => $data['watched_seconds'] >= $video->duration,
            ]
        );

        return response()->json(['message' => 'Progress saved', 'progress' => $progress]);
    }
}
