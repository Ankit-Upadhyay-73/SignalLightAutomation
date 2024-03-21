<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Signal extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $keyType = 'string';
    public $incrementing = false;


    protected $fillable=[
        "id","position"
    ];
}
