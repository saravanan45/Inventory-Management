class LeakyBucket {
    constructor(capacity, leakRate) {
        this.capacity = capacity; // Maximum number of requests in the bucket
        this.leakRate = leakRate;
        this.queue = []; 

        setInterval(this.leak, 1000 / this.leakRate);
    }

    addRequest(request) {
        if (this.queue.length < this.capacity) {
            this.queue.push(request);
            return true;
        }
        return false;
    }

    leak() {
        if (this.queue.length > 0) {
            this.queue.shift(); 
        }
    }
}

module.exports = LeakyBucket;