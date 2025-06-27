<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = ['title', 'description', 'thumbnail', 'slug'];

    public function videos()
    {
        return $this->hasMany(ModuleVideo::class);
    }
}
