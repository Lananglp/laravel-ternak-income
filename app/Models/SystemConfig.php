<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemConfig extends Model
{
    protected $table = 'system_config';

    protected $fillable = [
        'default_user_password',
    ];

    public $timestamps = false;

    // Define any additional methods or relationships if needed
}
