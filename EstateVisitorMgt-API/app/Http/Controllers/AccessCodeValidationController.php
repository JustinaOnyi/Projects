<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AccessCodeValidationController extends Controller
{
    public function validateCode(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6'
        ]);

        $code = $request->code;

        if (str_starts_with($code, '7')) {
            // Visitor Code
            $record = DB::table('visitor_access_codes')
                ->where('code', $code)
                ->first();

            if (!$record) {
                return response()->json([
                    'status' => 'denied',
                    'message' => 'Visitor code not found.'
                ], 404);
            }

            $now = Carbon::now();

            if ($record->status !== 'Valid' || $now->greaterThan(Carbon::parse($record->expires_at))) {
                return response()->json([
                    'status' => 'denied',
                    'message' => 'Visitor code expired or used.'
                ], 403);
            }

            return response()->json([
                'status' => 'granted',
                'type' => 'visitor',
                'code' => $code
            ], 200);

        } elseif (str_starts_with($code, '8')) {
            // Permanent Code
            $record = DB::table('access_codes')
                ->where('code', $code)
                ->first();

            if (!$record) {
                return response()->json([
                    'status' => 'denied',
                    'message' => 'Permanent code not found.'
                ], 404);
            }

            return response()->json([
                'status' => 'granted',
                'type' => 'permanent',
                'code' => $code
            ], 200);

        } else {
            return response()->json([
                'status' => 'denied',
                'message' => 'Code format not recognized.'
            ], 400);
        }
    }
}
