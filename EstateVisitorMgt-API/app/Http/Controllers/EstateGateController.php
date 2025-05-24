<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EstateGateController extends Controller
{

    // public function getStreets()
    // {
    //     $estateStreets = DB::table('estate_streets')
    //         ->join('states', 'estate_streets.state_id', '=', 'states.id')
    //         ->join('estate_locations', 'estate_streets.estate_location_id', '=', 'estate_locations.id')
    //         ->select(
    //             'estate_streets.id',
    //             'states.state_name as state_name',
    //             'estate_locations.location_name as location_name',
    //             'estate_streets.name as name'
    //         )
    //         ->get();
    
    //     return response()->json($estateStreets);
    // }
    

//     public function getStreets()
// {
//     $estateStreets = DB::table('estate_streets')
//         ->join('states', 'estate_streets.state_id', '=', 'states.id')
//         ->join('estate_locations', 'estate_streets.estate_location_id', '=', 'estate_locations.id')
//         ->select(
//             'estate_streets.id',
//             'estate_streets.state_id',
//             'estate_streets.estate_location_id',
//             'states.state_name as state_name',
//             'estate_locations.location_name as location_name',
//             'estate_streets.name as name'
//         )
//         ->select(
//            'estate_streets.state_id',
//             'estate_streets.estate_location_id',
//             'states.state_name as state_name',
//             'estate_locations.location_name as location_name',
//             'estate_streets.name as name'
//         )
//         ->distinct()
//         ->orderBy('estate_streets.name')
//         ->get();

//     return response()->json($estateStreets);
// }

public function getStreets()
{
    $estateStreets = DB::table('estate_streets')
        ->join('states', 'estate_streets.state_id', '=', 'states.id')
        ->join('estate_locations', 'estate_streets.estate_location_id', '=', 'estate_locations.id')
        ->select(
            'estate_streets.name',
            'estate_streets.state_id',
            'states.state_name',
            DB::raw('MIN(estate_streets.id) as id'), // get any id
            DB::raw('MIN(estate_streets.estate_location_id) as estate_location_id'),
            DB::raw('MIN(estate_locations.location_name) as location_name')
        )
        ->groupBy('estate_streets.name', 'estate_streets.state_id', 'states.state_name')
        ->orderBy('estate_streets.name')
        ->get();

    return response()->json($estateStreets);
}

    public function getStates()
    {
        $states = DB::table('states')->select('id', 'state_name')->get();
        return response()->json($states);
    }

    public function getLocationsByState($state_id)
    {
        $locations = DB::table('estate_locations')
            ->where('state_id', $state_id)
            ->select('id', 'location_name')
            ->get();

        return response()->json($locations);
    }

    public function getStreetsByLocation($location_id)
    {
        $streets = DB::table('estate_streets')
            ->where('estate_location_id', $location_id)
            ->select('id', 'name')
            ->get();

        return response()->json($streets);
    }

    public function storeStreet(Request $request)
    {
        
        $request->validate([
            'location_id' => 'required|integer',
            'street' => 'required|string|max:255',
            'state_id' => 'required|integer'
        ]);

        DB::table('estate_streets')->insert([
            'estate_location_id' => $request->location_id,
            'name' => $request->street,
            'state_id' => $request->state_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Street added successfully']);
    }

    public function updateStreet(Request $request, $id)
    {
        $request->validate([
            'estate_location_id' => 'required|integer',
            'name' => 'required|string|max:255',
        ]);

        DB::table('estate_streets')
            ->where('id', $id)
            ->update([
                'estate_location_id' => $request->estate_location_id,
                'name' => $request->name,
                'updated_at' => now(),
            ]);

        return response()->json(['message' => 'Street updated successfully']);
    }

    public function deleteStreet($id)
    {
        DB::table('estate_streets')->where('id', $id)->delete();

        return response()->json(['message' => 'Street deleted successfully']);
    }
}


