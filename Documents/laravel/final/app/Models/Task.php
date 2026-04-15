<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    // This allows Laravel to save data into these columns
    protected $fillable = [
        'user_id',
        'title',
        'description',
    ];

    // This tells Laravel that every task belongs to a User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}