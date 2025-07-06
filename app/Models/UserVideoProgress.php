<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserVideoProgress extends Model
{
    protected $fillable = [
        'user_id',
        'module_video_id',
        'watched_seconds',
        'watched_at',
        'is_completed',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'watched_at' => 'datetime',
    ];

    public function video(): BelongsTo
    {
        return $this->belongsTo(ModuleVideo::class, 'module_video_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
