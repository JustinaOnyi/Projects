<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class app_users extends Model
{
    //

  use HasFactory;

  protected $fillable = ['name', 'phoneno','role','house_address','category_id','login_code','modified_by']; // e.g., dependent, principal, security
}
