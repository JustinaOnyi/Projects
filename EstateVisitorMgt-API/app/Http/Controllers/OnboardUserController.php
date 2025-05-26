<?php

// app/Http/Controllers/UserController.php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class OnboardUserController extends Controller
{
    public function index()
    {
        return DB::table('app_users')
            ->select('id', 'name', 'phone', 'role', 'password', 'password_expiry')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string|unique:users,phone',
            'role' => 'required|string',
            'password' => 'required|confirmed|min:5'
        ]);

        DB::table('app_users')->insert([
            'name' => $request->name,
            'phone' => $request->phone,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'password_expiry' => Carbon::now()->addHours(2),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'User created'], 201);
    }

    public function update(Request $request, $id)
    {
        $data = $request->only('name', 'phone', 'role');
        if ($request->filled('password')) {
            $request->validate(['password' => 'confirmed|min:5']);
            $data['password'] = Hash::make($request->password);
            $data['password_expiry'] = Carbon::now()->addHours(2);
        }

        DB::table('app_users')->where('id', $id)->update(array_merge($data, [
            'updated_at' => now()
        ]));

        return response()->json(['message' => 'User updated']);
    }

    public function destroy($id)
    {
        DB::table('app_users')->where('id', $id)->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
