<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class AppUserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = DB::table('app_users')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        
        $data = $request->validate([
            'name' => 'required|string',
            'role' => 'required|string',
           'phone' => 'nullable|string',
            
        ]);

        DB::table('app_users')->insert([
            'name' => $data['name'],
            'role' => $data['role'],
            'phone' => $data['phone'] ?? null,
           
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'User created successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|string',
            
            'role' => 'required|string',
            
            'phone' => 'nullable|string',
            
        ]);

        DB::table('app_users')->where('id', $id)->update([
            'name' => $data['name'],
           
            'role' => $data['role'],
           
            'phone' => $data['phone'] ?? null,
            
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'User updated successfully']);
    }

    public function destroy($id): JsonResponse
    {
        DB::table('app_users')->where('id', $id)->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
