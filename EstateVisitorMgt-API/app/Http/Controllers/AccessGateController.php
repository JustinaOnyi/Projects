<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccessGateController extends Controller
{
    public function index()
    {
        $gates = DB::table('access_gates')
            ->join('estate_streets', 'access_gates.street_id', '=', 'estate_streets.id')
            ->select(
                'access_gates.id as id',
                'access_gates.gate_name as gate',
                'estate_streets.name as street',
                'estate_streets.id as street_id',
            )
            ->orderBy('access_gates.id', 'desc')
            ->get();
    
        return response()->json($gates);
    }
    

    public function store(Request $request)
    {
        $request->validate([
            'street_id' => 'required|exists:estate_streets,id',
            'gate_name' => 'required|string|max:255',
        ]);

        DB::table('access_gates')->insert([
            'street_id' => $request->street_id,
            'gate_name' => $request->gate_name,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Access gate added successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'street_id' => 'required|string|max:255',
            'gate_name' => 'required|string|max:255',
        ]);

        $updated = DB::table('access_gates')->where('id', $id)->update([
            'street_id' => $request->street_id,
            'gate_name' => $request->gate_name,
            'updated_at' => now(),
        ]);

        if ($updated) {
            return response()->json(['message' => 'Access gate updated successfully']);
        }

        return response()->json(['message' => 'Access gate not found'], 404);
    }

    public function destroy($id)
    {
        $deleted = DB::table('access_gates')->where('id', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Access gate deleted successfully']);
        }

        return response()->json(['message' => 'Access gate not found'], 404);
    }

    // Optional: fetch distinct streets
    // public function getDistinctStreets()
    // {
    //     $streets = DB::table('estate_streets')->select('name')->distinct()->get();
    //     return response()->json($streets);
    // }
}

