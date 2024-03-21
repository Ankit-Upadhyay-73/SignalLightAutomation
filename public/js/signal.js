
$(document).ready(function(){

    $("#start_button").on("click", function(){
        SignalProcess.onStart();
    });

    $("#stop_button").on("click", function(){
        SignalProcess.onStop();
    });

    $("#l1_s,#l2_s,#l3_s,#l4_s").on("change", function(e){
        let ele = e.target;
        let valid = true;
        if(ele.value > 4)
            valid=false;
        if(ele.value != ""){
            if($("#l1_s").val() == ele.value && ele.id != "l1_s")
                valid=false;
            if($("#l2_s").val() == ele.value && ele.id != "l2_s")
                valid=false;
            if($("#l3_s").val() == ele.value && ele.id != "l3_s")
                valid=false;
            if($("#l4_s").val() == ele.value && ele.id != "l4_s")
                valid=false;
        }

        if(!valid){
            alert("unacceptable input");
            ele.value=0;
            return;
        }
        SignalProcess.onChangeSequence(ele.id,ele.value);
    });

    $("#y_i,#g_i").on("change", function(e){
        let ele = e.target;
        if(ele.value!="" && (ele.value<1 || ele.value>50))
            ele.value =1;
        SignalProcess.onChangeInterval((ele.id=="y_i" ? "yellow" : "green"), ele.value);
    });

    SignalProcess.loadConf();
});

function Signal(el){
    this.el = el;
    this.on = function(signal){
        $("#"+(this.el.replace("_s",""))).css('background-color', this.lights[signal].colour);
        $("#"+(this.el)).css('background-color', this.lights[signal].colour);
    }
    this.off = function(){
        $("#"+(this.el.replace("_s",""))).css('background-color', '#ffffff');
        $("#"+(this.el)).css('background-color', '#ffffff');

    }
    this.start = function(signal){
        this.on(signal);
    },
    this.set = function(lights){
        this.lights = lights;
    },
    this.deployChanges=function(){
        let _this = this;
        $.ajax({
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            url: "/api/sequence",
            data:{'id':_this.el,'position':_this.position},
            type:'POST',
            dataType: 'json',
            success:function(data){
                console.log(data);
            }
        });
    },
    this.position = null
}

let SignalProcess = {
    conf:{
        green: {interval: 0,colour:'#ff0000'},
        yellow: {interval:0,colour:'#ffff00'}
    },
    counter: 1,
    signals : [
        new Signal('l1_s'),
        new Signal('l2_s'),
        new Signal('l3_s'),
        new Signal('l4_s')
    ],
    onChangeInterval: function(signal,interval){
        this.conf[signal].interval = parseInt(interval);
        this.deployIntervalChanges(signal);
    },
    onChangeSequence: function(el,position){
        let signal = this.signals.find(signal=>signal.el == el);
        signal.position = parseInt(position);
        signal.deployChanges();
    },
    onStart: function(){

        SignalProcess.signals.forEach((signal)=>{
            if(signal.position =="" || signal.position==0)
                return;
        });
        if([0,""].includes(SignalProcess.conf.green.interval) ||[0,""].includes(SignalProcess.conf.yellow.interval))
            return;

        const sec = 1000;
        let exec = 1;
        this.signals.forEach(signal=>signal.set(SignalProcess.conf));

        this.conf.green.intervalHandler = setInterval(function(){
            if(exec++ == SignalProcess.conf['green']['interval']){
                exec = 1;
                let signal = SignalProcess.signals.find(signal=>signal.position==SignalProcess.counter)
                signal.off();
                signal.start('yellow');
                setTimeout(()=>{
                    signal.off();
                },SignalProcess.conf.yellow.interval * 1000);

                if(SignalProcess.counter++ == SignalProcess.signals.length){
                    SignalProcess.counter = 1;
                }
            }
            // finding that countered signal
            SignalProcess.signals.find(signal=>signal.position==SignalProcess.counter).start('green');
        },sec);
    },

    onStop:function(){
        clearInterval(this.conf.green.intervalHandler);
    },
    deployIntervalChanges:function(signal){
        let _this = this;
        $.ajax({
            // headers:{
            //     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            // },
            url: "/api/interval",
            data:{'colour':_this.conf[signal]['colour'],'interval':_this.conf[signal]['interval']},
            type:'POST',
            dataType: 'json',
            success:function(data){
                // console.log(data);
            }
        });
    },

    loadConf:function(){
        $.ajax({
            headers:{
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            },
            url: "/api/parameters",
            type:'GET',
            dataType: 'json',
            success:function(response){
                let data = response.data;
                if(data.signals){
                    data.signals.forEach((dSignal)=>{
                        SignalProcess.signals.find(signal=>signal.el == dSignal.id).position = dSignal.position;
                        $("#"+dSignal.id).val(dSignal.position);
                    });
                    console.log("Setuped the signals");
                }
                if(data.intervals){
                    data.intervals.forEach((interval)=>{
                        if(interval.colour == "#ff0000"){
                            SignalProcess.conf.green.interval = interval['interval'];
                            $("#g_i").val(interval['interval']);
                        }
                        if(interval.colour == "#ffff00"){
                            SignalProcess.conf.yellow.interval = interval['interval'];
                            $("#y_i").val(interval['interval']);
                        }
                    });
                    console.log("Setuped the intervals");

                }
            }
        })
    }
}


