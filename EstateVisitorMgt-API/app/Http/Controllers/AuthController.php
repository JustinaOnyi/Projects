<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\app_users;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
 

        public function registerSuperAdmin(Request $request)
        {
            // Check if a Super Admin already exists
            $existingSuperAdmin = DB::table('app_users')
                ->where('role', 'Super Admin')
                ->first();

            if ($existingSuperAdmin) {
                return response()->json([
                    'message' => 'A Super Admin account already exists. Registration is disabled.'
                ], 403); // 403 Forbidden
            }
           
            // Validate input
            $validator = Validator::make($request->all(), [
                'name'     => 'required|string|max:255',
                'phone'    => 'required|string|unique:app_users,phone',
                'password' => 'required|string|min:5',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Insert user into DB
            $userId = DB::table('app_users')->insertGetId([
                'name'       => $request->name,
                'phone'      => $request->phone,
                'password'   => Hash::make($request->password),
                'role'       => 'Super Admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $newUser = DB::table('app_users')->where('id', $userId)->first();

            return response()->json([
                'message' => 'Super Admin registered successfully',
                'user'    => $newUser
            ], 201);
        }

        //
        public function login(Request $request)
        {
            $request->validate([
                'phone' => 'required|string',
                'password' => 'required|string'
            ]);
        
            $user = DB::table('app_users')->where('phone', $request->phone)->first();
        
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }
        
            // Return basic user info
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'phone' => $user->phone,
                    'role' => $user->role,
                ]
            ]);
        }
}
