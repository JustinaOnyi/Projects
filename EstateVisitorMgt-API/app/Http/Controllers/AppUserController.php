<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppUserController extends Controller
{
    //

     // List all app user
     public function index()
     {
    
         try {
             $get_all_appusers = DB::table('app_users')->get();
             return response()->json($get_all_appusers);
         } catch (\Exception $e) {
             return response()->json(['error' => $e->getMessage()], 500);
         }
     }
 
     // Create a new app user
     public function store(Request $request)
     {
         $request->validate([
             'name' => 'required|string|max:255'
         ]);
 
         try {
             DB::table('app_users')->insert([
                 'name' => $request->name,
                 'created_at' => now(),
                 'updated_at' => now(),
             ]);
             return response()->json(['message' => 'User created successfully.']);
         } catch (\Exception $e) {
             return response()->json(['error' => $e->getMessage()], 500);
         }
     }
 
     // Update an existing app user
     public function update(Request $request, $id)
     {
         $request->validate([
             'name' => 'required|string|max:255'
         ]);
 
         try {
             $updated = DB::table('app_users')
                 ->where('id', $id)
                 ->update([
                     'name' => $request->name,
                     'updated_at' => now(),
                 ]);
 
             if ($updated) {
                 return response()->json(['message' => 'user updated successfully.']);
             } else {
                 return response()->json(['message' => 'No changes made or user not found.'], 404);
             }
         } catch (\Exception $e) {
             return response()->json(['error' => $e->getMessage()], 500);
         }
     }
 
     // Delete an app user
     public function destroy($id)
     {
         try {
             $deleted = DB::table('app_users')->where('id', $id)->delete();
 
             if ($deleted) {
                 return response()->json(['message' => 'user deleted successfully.']);
             } else {
                 return response()->json(['message' => 'user not found.'], 404);
             }
         } catch (\Exception $e) {
             return response()->json(['error' => $e->getMessage()], 500);
         }
     }
}
