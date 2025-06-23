<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipBenefit extends Model
{
    protected $fillable = ['membership_id', 'benefit', 'is_active', 'position'];

    public function membership()
    {
        return $this->belongsTo(Membership::class);
    }
}
