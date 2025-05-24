<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class MacDeviceController extends Controller
{
    public function index()
    {
        $devices = DB::table('mac_devices')->get();
        return response()->json($devices);


    }

    public function store(Request $request)
    {
        $request->validate([
            'mac_address' => 'required|string|unique:mac_devices,mac_address',
        ]);

        DB::table('mac_devices')->insert([
            'mac_address' => $request->mac_address,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'MAC address added successfully']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'mac_address' => 'required|string|unique:mac_devices,mac_address,' . $id,
        ]);

        $updated = DB::table('mac_devices')
            ->where('id', $id)
            ->update([
                'mac_address' => $request->mac_address,
                'updated_at' => now(),
            ]);

        if (!$updated) {
            return response()->json(['message' => 'MAC address not found or no change made'], 404);
        }

        return response()->json(['message' => 'MAC address updated successfully']);
    }

    public function destroy($id)
    {
        $deleted = DB::table('mac_devices')->where('id', $id)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'MAC address not found'], 404);
        }

        return response()->json(['message' => 'MAC address deleted successfully']);
    }
}
