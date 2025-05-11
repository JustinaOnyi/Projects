<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    // List all categories
    public function index()
    {
        try {
            $categories = DB::table('category')->get();
            return response()->json($categories);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Create a new category
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        try {
            DB::table('category')->insert([
                'name' => $request->name,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return response()->json(['message' => 'Category created successfully.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Update an existing category
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        try {
            $updated = DB::table('category')
                ->where('id', $id)
                ->update([
                    'name' => $request->name,
                    'updated_at' => now(),
                ]);

            if ($updated) {
                return response()->json(['message' => 'Category updated successfully.']);
            } else {
                return response()->json(['message' => 'No changes made or category not found.'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Delete a category
    public function destroy($id)
    {
        try {
            $deleted = DB::table('category')->where('id', $id)->delete();

            if ($deleted) {
                return response()->json(['message' => 'Category deleted successfully.']);
            } else {
                return response()->json(['message' => 'Category not found.'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
