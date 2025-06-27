<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleVideo extends Model
{
    protected $table = 'module_videos';

    protected $fillable = [
        'module_id',
        'title',
        'description',
        'video_url',
        'duration',
        'position',
        'is_preview',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(UserVideoProgress::class);
    }
}
