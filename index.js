
class Snowflake {
    constructor(workerId, datacenterId, sequence = 0) {
        this.workerId = workerId;
        this.datacenterId = datacenterId;
        this.sequence = sequence;
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
        return ((timestamp - this.epoch) << this.timestampLeftShift) | (this.datacenterId << this.datacenterIdShift) | (this.workerId << this.workerIdShift) | this.sequence;
    }

    waitNextMillis() {
        let timestamp = Date.now();
        while (timestamp <= this.lastTimestamp) {
            timestamp = Date.now();
        }
        return timestamp;
    }

    parseSnowflake(snowflakeId) {
        const mask = (1 << this.timestampBits) - 1;
        const timestamp = new Date((snowflakeId >> this.timestampLeftShift) + this.epoch);
        const datacenterId = (snowflakeId >> this.datacenterIdShift) & this.maxDatacenterId;
        const workerId = (snowflakeId >> this.workerIdShift) & this.maxWorkerId;
        const sequence = snowflakeId & this.sequenceMask;
        return { timestamp, datacenterId, workerId, sequence };
    }

    isValidSnowflake(snowflakeId) {
        const timestamp = (snowflakeId >> this.timestampLeftShift) + this.epoch;
        return timestamp <= Date.now();
    }
}

const snowflake = new Snowflake(1, 1);
const id = snowflake.generate();
const parsedId = snowflake.parseSnowflake(id);
const isValid = snowflake.isValidSnowflake(id);
