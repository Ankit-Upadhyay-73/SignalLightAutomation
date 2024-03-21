<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Signal Problem</title>
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

        <link rel="stylesheet" href="{{URL::asset('css/index.css')}}">
        <script src="{{URL::asset('js/signal.js')}}"  defer > </script>

        <script src="https://code.jquery.com/jquery-3.7.1.js"
            integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>

    </head>
    <body class="antialiased">

        <div class="main">
            <h1> Lights: </h1>
            <div class="lights">
                <div><span>sequence.</span></div>
                <div>
                    <div class="circle" id="l1"></div><br>
                    <input type="number" id="l1_s" min=1 max=4 /> <br />
                </div>

                <div>
                    <div class="circle" id="l2"></div><br>
                    <input type="number" id="l2_s" min=1 max=4 /> <br />
                </div>

                <div>
                    <div class="circle" id="l3"></div> <br>
                    <input type="number" id="l3_s" min=1 max=4 /> <br />
                </div>

                <div>
                    <div class="circle" id="l4"></div><br>
                    <input type="number" id="l4_s" min=1 max=4  /> <br />
                </div>
            </div>
            <br>

            <div class="intervals">
                <div id="g_i_div">
                    <span> Green light interval: </span>
                    <input type="number" id="g_i" min=1 max=50> <span>sec.</span>
                </div>
                <div id="y_i_div">
                    <span> Yellow light interval: </span>
                    <input type="number" id="y_i" min=1 max=50> <span>sec.</span>
                </div>
            </div>
            <br>

            <div class="control_buttons">
                <button id="start_button" value="Start"> Start </button>
                <button id="stop_button" value="Stop"> Stop </button>
            </div>
        </div>

    </body>
</html>
