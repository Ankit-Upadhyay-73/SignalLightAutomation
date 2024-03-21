<?php

use App\Models\LightInterval;
use App\Models\Signal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/sequence',function(Request $request){
    $signalid = $request->get('id');
    $signalposition = $request->get('position');

    $signal = Signal::firstOrCreate(["id"=> $signalid],[
        "position"=>$signalposition
    ]);
    $signal->position = $signalposition;
    $signal->save();

    return response()->json(["status"=>"success"],204);

});

Route::post('/interval',function(Request $request){

    $lightSignal = LightInterval::firstOrCreate(["colour"=> $request->get('colour')],[
        "interval"=>$request->get('interval')
    ]);

    $lightSignal->interval = $request->get('interval');
    $lightSignal->save();

    return response()->json(["status"=>"success"], 204);
});

Route::get('/parameters',function(Request $request){

    $signals=[];
    $intervals=[];
    foreach(Signal::all() as $signal){
        $signals[] = ["id"=>$signal->id, "position"=>$signal->position];
    }

    foreach(LightInterval::all() as $light){
        $intervals[] = ["colour"=>$light->colour, "interval"=>$light->interval];
    }

    return response()->json(["data"=>["signals"=>$signals,"intervals"=>$intervals]],200);
});
