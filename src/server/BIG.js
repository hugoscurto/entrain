export default class BIG {
    constructor(featureSize, systemOptimal, userInput) {

        // starting point of system optimal
        this.systemOptimal = systemOptimal;
        console.log(this.systemOptimal)

        // define the space
        this.space = [];

        // the width and height
        this.featureSize = featureSize;
        for (var i = 0; i < this.featureSize * this.featureSize; i++){
            this.space.push(i);
        }
        this.space_2d = this.onedto2d(this.space);

        // define the probability
        this.p_space = [];
        for (var i = 0; i < this.featureSize * this.featureSize; i++){
            // this.p_space.push(0.3/15);
            this.p_space.push(0.1/(this.featureSize * this.featureSize - 1));
        }
        this.p_space_2d = this.onedto2d(this.p_space);
        // this.p_space_2d[1][2] = 0.7;
        this.p_space_2d[this.systemOptimal[0]][this.systemOptimal[1]] = 0.9;

        const p_space_2d = this.p_space_2d;

        this.updates = p_space_2d;

        // the number of user input
        this.User_input = userInput;

        // starting point of user
        this.user_position = [0, 0];

        
    }

    // turn 1d array into 2d
    onedto2d(Array1d){
        var Array2d = [];
        while(Array1d.length) Array2d.push(Array1d.splice(0, this.featureSize));
        return Array2d;
    }

    // turn 2d array into 1d
    twodto1d(Array2d){
        var Array1d = [];
        for(var i = 0; i < Array2d.length; i++)
        {
            Array1d = Array1d.concat(Array2d[i]);
        }
        return Array1d;
    }

    // get the index of an item
    getIndexOfK(arr, k) {
        for (var i = 0; i < arr.length; i++) {
            var index = arr[i].indexOf(k);
            if (index > -1) {
                return [i, index];
            }
        }
    }

    // compute entropy using a 2d array
    entropy(Array){
        var to_compute = this.twodto1d(Array);
        var sum = 0;
        for (var i = 0; i < to_compute.length; i++){
            if (to_compute[i] != 0){
                sum = sum + to_compute[i] * Math.log2(to_compute[i]);
            }
        }
        return -sum;
    }

    // to define what is supposed to be the user input given an optimal zone and a user zone
    // prioritize vertical space
    sinput(Ozone, Uzone){
        var sinp = 0;
        if (Uzone[0] > Ozone[0]){
            sinp = 2;
        } else if (Uzone[0] < Ozone[0]) {
            sinp = 4;
        } else if (Uzone[1] > Ozone[1]) {
            sinp = 1;
        } else if (Uzone[1] < Ozone[1]){
            sinp = 3;
        } else if (Uzone[0] == Ozone[0] & Uzone[1] == Ozone[1]){
            sinp = 0;
        }
        return sinp;
    }

    // define user position after user input
    user_pos_up(pos_avant, user_inp) {
        var pos_apres = pos_avant;

        var i = pos_avant[0];
        var j = pos_avant[1];

        if (user_inp == 1) {
            j = j - 1;
        } else if (user_inp == 2) {
            i = i - 1;
        } else if (user_inp == 3) {
            j = j + 1;
        } else if (user_inp == 4) {
            i = i + 1;
        }

        pos_apres[0] = i;
        pos_apres[1] = j;
        return pos_apres;
    }

    // user behavior model
    // can be changed / optimized
    Pr_u_t_v(user_move, optimal, user_pos) {
        var comp = this.sinput(optimal, user_pos);
        var p = 0

        if (user_move == 1) {
            if (comp == 1) { p = 0.8; }
            else if (comp == 2) { p = 0.05; }
            else if (comp == 3) { p = 0.05; }
            else if (comp ==4) { p = 0.05; }
            else if (comp == 0) { p = 0.05; }
        }

        if (user_move == 2) {
            if (comp == 1) { p = 0.05; }
            else if (comp == 2) { p = 0.8; }
            else if (comp == 3) { p = 0.05; }
            else if (comp ==4) { p = 0.05; }
            else if (comp == 0) { p = 0.05; }
        }

        if (user_move == 3) {
            if (comp == 1) { p = 0.05; }
            else if (comp == 2) { p = 0.05; }
            else if (comp == 3) { p = 0.8; }
            else if (comp ==4) { p = 0.05; }
            else if (comp == 0) { p = 0.05; }
        }

        if (user_move == 4) {
            if (comp == 1) { p = 0.05; }
            else if (comp == 2) { p = 0.05; }
            else if (comp == 3) { p = 0.05; }
            else if (comp ==4) { p = 0.8; }
            else if (comp == 0) { p = 0.05; }
        }

        if (user_move == 0) {
            if (comp == 1) { p = 0.05; }
            else if (comp == 2) { p = 0.05; }
            else if (comp == 3) { p = 0.05; }
            else if (comp ==4) { p = 0.05; }
            else if (comp == 0) { p = 0.8; }
        }

        return p;
    }

    // the sum of the user behavior function
    Pr_u_v(user_move, user_pos) {
        var sum = 0;
        var updates_1d = this.twodto1d(this.updates);
        for (var i = 0; i < updates_1d.length; i++) {
            var  opti = this.getIndexOfK(this.space_2d, i);
            sum = sum + this.Pr_u_t_v(user_move, opti, user_pos) * updates_1d[i];
        }
        return sum
    }

    // regularize the search area
    regularization() {
        const system_optimal = this.systemOptimal;

        var search_area = [];
        search_area.push(system_optimal);
        var i = system_optimal[0];
        var j = system_optimal[1];
        if (i - 1 > -1) {
            search_area.push([i-1,j]);
        }
        if (i + 1 < this.featureSize) {
            search_area.push([i+1,j]);
        }
        if (j - 1 > -1) {
            search_area.push([i,j-1]);
        }
        if (j + 1 < this.featureSize) {
            search_area.push([i,j+1]);
        }
        if (i - 1 > -1 && j - 1 > -1) {
            search_area.push([i-1,j-1]);
        }
        if (i + 1 < this.featureSize && j + 1 < this.featureSize) {
            search_area.push([i + 1, j+1]);
        }
        if (i - 1 > -1 && j + 1 < this.featureSize) {
            search_area.push([i - 1, j+1]);
        }
        if (i + 1 < this.featureSize && j - 1 > -1) {
            search_area.push([i + 1, j - 1]);
        }
        return search_area;
    }

    setUpdatesOnedTo2d(updates_1d) {
        this.updates = this.onedto2d(updates_1d);
    }

    setUserPosition(user_position, user_move) {
        this.user_position = this.user_pos_up(user_position, user_move);
    }

    setRealUserPosition(user_position) {
        this.user_position = user_position;
    }

    // update distribution after user input (user move)
    Update(user_move, user_position) {
        const updates = this.updates;
        // const user_position = this.user_position;
        const space_2d = this.space_2d;
        console.log('user_move', user_move)
        console.log('user_position', user_position)

        // compute entropy before updating
        let H_before = this.entropy(updates);

        // update probability distribution
        let temp = this.Pr_u_v(user_move, user_position);
        let updates_1d = this.twodto1d(updates);
        for (let i = 0; i < updates_1d.length; i++) {
            let opti = this.getIndexOfK(space_2d, i);
            updates_1d[i] = updates_1d[i] * this.Pr_u_t_v(user_move, opti, user_position) / temp;
        }

        // compute entropy after updating
        let somme = 0
        for (let j = 0; j < updates_1d.length; j++) {
            somme = somme + updates_1d[j];
        }

        for (let x = 0; x < updates_1d.length; x++) {
            updates_1d[x] = updates_1d[x] / somme;
        }

        this.setUpdatesOnedTo2d(updates_1d);

        let H_after = this.entropy(this.onedto2d(updates_1d));
        // this.setUserPosition(user_position, user_move);
        // console.log('this.user_position', this.user_position);
        console.log("The actual information gain is: ", Math.abs(H_after - H_before));
        console.log("The current distribution is: " , this.updates);
    }

    // given a system feedback, compute the expected information gain
    E_IG(sys_pos){
        var temp1 = 0;
        var temp2 = 0;
        var sum1 = 0;
        var sum2 = 0;

        var exp_updates = this.updates;

        for (var i = 0; i < this.User_input; i++) {
            if (this.Pr_u_v(i, sys_pos) != 0){
                temp1 = - this.Pr_u_v(i, sys_pos) * Math.log2(this.Pr_u_v(i, sys_pos));
            } else {
                temp1 = 0;
            }
            sum1 = sum1 + temp1;
        }

        var exp_updates_1d = this.twodto1d(exp_updates);

        for (var j = 0; j < this.featureSize * this.featureSize; j++) {
            var opti = this.getIndexOfK(this.space_2d, j);
            for (var k = 0; k < this.User_input; k++) {
                if (this.Pr_u_t_v(k, opti, sys_pos) != 0) {
                    temp2 = - exp_updates_1d[j] * this.Pr_u_t_v(k, opti, sys_pos) * Math.log2(this.Pr_u_t_v(k, opti, sys_pos));
                } else {
                    temp2 = 0;
                }
            }
            sum2 = sum2 + temp2;
        }

        return sum1 - sum2;
    }

    //go over all possible feedback with regularization, compute the maximum expected information gain
    Max_E_IG(){
        var max_IG = 0;
        var search = this.regularization();
        for (var i = 0; i < search.length; i++) {
            if (this.E_IG(search[i]) > max_IG) {
                var opt = search[i];
                max_IG = this.E_IG(search[i]);
            }
        }
        // system_optimal = opt;
        this.updateSystemOptimal(opt);
        return opt;
    }

    updateSystemOptimal(system_optimal) {
        this.systemOptimal = system_optimal;
        console.log("Best system position: ", this.systemOptimal);
    }

    isInAIFeedback(instrumentFeatures) {
        if (instrumentFeatures.toString() === this.systemOptimal.toString()) {
            return true;
        } else {
            return false;
        }
    }

    computeClosestInstrument(instrumentFeatures, enteredClients) {
        const systemOptimal = this.systemOptimal;

        // let distances = new Array(instrumentFeatures.length);
        // for (let inst = 0; inst < instrumentFeatures.length; inst++) {
        //     distances[inst] = Math.abs(instrumentFeatures[inst][0] - systemOptimal[0]);
        //     distances[inst] += Math.abs(instrumentFeatures[inst][1] - systemOptimal[1]);
        // }

        let distances = new Array(enteredClients.length);
        for (let inst in enteredClients) {
            distances[inst] = Math.abs(instrumentFeatures[inst][0] - systemOptimal[0]);
            distances[inst] += Math.abs(instrumentFeatures[inst][1] - systemOptimal[1]);
        }

        return enteredClients[distances.indexOf(Math.max(...distances))]
    }
}
// // to run the system
// while (Math.max(twodto1d(p_space_2d)) < 0.99) {

//     // TO DO: need to get the user position
//     var user_position;
//     Update(user_position);

//     // TO DO: need to define how the system responds - Max_E_IG() only returns the system position
//     Max_E_IG();
