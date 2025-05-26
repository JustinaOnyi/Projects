<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EstateController extends Controller
{
    public function index()
    {
        $estates = DB::table('estates')->get();
        return response()->json($estates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'estate_name'     => 'required|string|max:255',
            'state'           => 'required|string|max:100',
            'location'        => 'required|string|max:100',
            'date_registered' => 'required|date',
            'payment_date'    => 'required|date',
        ]);

        $id = DB::table('estates')->insertGetId([
            'estate_name'     => $validated['estate_name'],
            'state'           => $validated['state'],
            'location'        => $validated['location'],
            'date_registered' => $validated['date_registered'],
            'payment_date'    => $validated['payment_date'],
            'active'          => true,
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);

        $newEstate = DB::table('estates')->where('id', $id)->first();

        return response()->json($newEstate, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'estate_name'     => 'required|string|max:255',
            'state'           => 'required|string|max:100',
            'location'        => 'required|string|max:100',
            'date_registered' => 'required|date',
            'payment_date'    => 'required|date',
        ]);

        DB::table('estates')
            ->where('id', $id)
            ->update([
                'estate_name'     => $validated['estate_name'],
                'state'           => $validated['state'],
                'location'        => $validated['location'],
                'date_registered' => $validated['date_registered'],
                'payment_date'    => $validated['payment_date'],
                'updated_at'      => now(),
            ]);

        return response()->json(['message' => 'Estate updated successfully']);
    }

    public function destroy($id)
    {
        DB::table('estates')->where('id', $id)->delete();

        return response()->json(['message' => 'Estate deleted successfully']);
    }

    public function toggleActive($id)
    {
        $estate = DB::table('estates')->where('id', $id)->first();

        if (!$estate) {
            return response()->json(['message' => 'Estate not found'], 404);
        }

        $newStatus = !$estate->active;

        DB::table('estates')
            ->where('id', $id)
            ->update([
                'active' => $newStatus,
                'updated_at' => now(),
            ]);

        return response()->json(['message' => 'Estate status updated', 'active' => $newStatus]);
    }
}
