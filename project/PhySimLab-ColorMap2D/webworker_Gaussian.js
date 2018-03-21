onmessage = function(event) {
    var param = event.data;
    var currentStep = param.currentStep;
    var period = param.period;
    var sigma = param.sigma;
    var z0 = param.z0;
    var R = param.R;
    var N = param.N;
    var l = param.l;

    var data = new Array(N + 1);
    var omega = 2 * Math.PI / period;
    var x_ = R * Math.cos(omega * currentStep);
    var y_ = R * Math.sin(omega * currentStep);
    for (var index = 0; index <= N; index++) {
        data[index] = new Array(N + 1);
        for (j = 0; j <= N; j++) {
            var x = (-N / 2 + index) * l;
            var y = (-N / 2 + j) * l;
            var z = z0 * Math.exp(-((x - x_) * (x - x_) + (y - y_) * (y - y_)) / (2 * sigma));
            data[index][j] = z;
        }
    }
    postMessage({ data: data, currentStep: currentStep });
}