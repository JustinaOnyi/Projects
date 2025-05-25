<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class VisitorAccessCodeController extends Controller
{
    public function index()
    {
        $codes = DB::table('visitor_access_codes')->get();
        return response()->json($codes);
    }

    public function store(Request $request)
{
    $request->validate([
        'phone' => 'required|string|regex:/^0\d{10}$/'
    ]);

    // Check if there's a valid (not expired or used) code already
    $existing = DB::table('visitor_access_codes')
        ->where('phone', $request->phone)
        ->where('status', 'Valid')
        ->where('expires_at', '>', now())
        ->first();

    if ($existing) {
        return response()->json([
            'message' => 'This phone number already has a valid access code.',
            'code' => $existing
        ], 409); // 409 Conflict
    }

    $code = '7' . substr(strval(rand(100000, 999999)), 1);
    $createdAt = now();
    $expiresAt = $createdAt->copy()->addHours(2);

    $id = DB::table('visitor_access_codes')->insertGetId([
        'phone' => $request->phone,
        'code' => $code,
        'created_at' => $createdAt,
        'expires_at' => $expiresAt,
        'status' => 'Valid'
    ]);

    $record = DB::table('visitor_access_codes')->where('id', $id)->first();

    return response()->json($record, 201);
}


    public function update(Request $request, $id)
    {
        $code = '7' . substr(strval(rand(100000, 999999)), 1);
        $createdAt = Carbon::now();
        $expiresAt = $createdAt->copy()->addHours(2);

        DB::table('visitor_access_codes')->where('id', $id)->update([
            'code' => $code,
            'created_at' => $createdAt,
            'expires_at' => $expiresAt,
            'status' => 'Valid'
        ]);

        $updated = DB::table('visitor_access_codes')->where('id', $id)->first();
        return response()->json($updated);
    }

    public function markAsUsed($id)
    {
        DB::table('visitor_access_codes')->where('id', $id)->update([
            'status' => 'Used'
        ]);

        return response()->json(['message' => 'Code marked as used.']);
    }
}


