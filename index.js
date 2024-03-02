class Snowflake {
    constructor(workerId, datacenterId, sequence = 0) {
        this.workerId = workerId;
        this.datacenterId = datacenterId;
        this.sequence = sequence;

        // Snowflake Epoch (January 1, 2020)
        this.epoch = 1577836800000;
        this.timestampBits = 41;
        this.workerIdBits = 5;
        this.datacenterIdBits = 5;
        this.sequenceBits = 12;

        this.maxWorkerId = -1 ^ (-1 << this.workerIdBits);
        this.maxDatacenterId = -1 ^ (-1 << this.datacenterIdBits);

        this.workerIdShift = this.sequenceBits;
        this.datacenterIdShift = this.sequenceBits + this.workerIdBits;
        this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
        this.sequenceMask = -1 ^ (-1 << this.sequenceBits);

        this.lastTimestamp = -1;
    }

    generate() {
        let timestamp = Date.now();

        if (timestamp < this.lastTimestamp) {
            throw new Error('Invalid system clock');
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & this.sequenceMask;
            if (this.sequence === 0) {
                timestamp = this.waitNextMillis();
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = timestamp;

        return ((timestamp - this.epoch) << this.timestampLeftShift) |
            (this.datacenterId << this.datacenterIdShift) |
            (this.workerId << this.workerIdShift) |
            this.sequence;
    }

    waitNextMillis() {
        let timestamp = Date.now();
        while (timestamp <= this.lastTimestamp) {
            timestamp = Date.now();
        }
        return timestamp;
    }
}

// Example usage:
const snowflake = new Snowflake(1, 1);
console.log(snowflake.generate());
