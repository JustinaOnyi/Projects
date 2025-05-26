<?php

namespace App\Http\Controllers;

// use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AccessCodeController extends Controller
{
    // Get all users with role = 'principal_user'
    public function getPrincipalUsers()
    {
        $users = DB::table('app_users')
                    ->where('role', 'Principal User')
                    ->select('id', 'name', 'phone')
                    ->get();

        return response()->json($users);
    }

    public function getDependantsForPrincipalUser(Request $request)
    {
        $principalId = $request->query('principal_id');
        $dependants = DB::table('app_users')
            ->where('registered_by', $principalId)
            ->select('id', 'name', 'phone')
            ->get();
    
        return response()->json($dependants);
    }

    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'user_id' => 'required|integer',
        'code' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Delete old codes for the user
    DB::table('access_codes')->where('user_id', $request->user_id)->delete();

    // Insert new code and get the inserted ID
    $id = DB::table('access_codes')->insertGetId([
        'user_id' => $request->user_id,
        'code' => $request->code,
        'created_at' => now(),
        'updated_at' => now()
    ]);

    return response()->json([
        'id' => $id, // Now returning the real ID
        'user_id' => $request->user_id,
        'code' => $request->code,
        'created_at' => now()
    ]);
}


    // Update (reset) an access code by ID
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exists = DB::table('access_codes')->where('id', $id)->exists();

        if (!$exists) {
            return response()->json(['message' => 'Access code not found.'], 404);
        }

        DB::table('access_codes')->where('id', $id)->update([
            'code' => $request->code,
            'updated_at' => now()
        ]);

        return response()->json([
            'message' => 'Code updated successfully.',
            'code' => $request->code
        ]);
    }


    public function listCodes()
{
    $records = DB::table('access_codes')
        ->join('app_users', 'access_codes.user_id', '=', 'app_users.id')
        ->select('access_codes.id', 'app_users.name as user', 'app_users.phone', 'access_codes.code', 'access_codes.created_at')
        ->orderBy('access_codes.created_at', 'desc')
        ->get();

    return response()->json($records);
}

}
