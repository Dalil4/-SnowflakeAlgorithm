## Snowflake Generator

### Description

The Snowflake Generator is a JavaScript class designed to generate unique snowflake IDs based on the Twitter Snowflake algorithm. Snowflake IDs are commonly used in distributed systems to generate unique IDs with a timestamp, worker ID, and sequence number.

### Functionality

The Snowflake class provides the following functionality:

- **Generation**: It generates a unique snowflake ID based on the current timestamp, worker ID, and sequence number.
- **Parsing**: It can parse a snowflake ID to extract its timestamp, worker ID, and sequence number.
- **Validity Check**: It can check the validity of a snowflake ID based on its timestamp.

### Usage

1. Instantiate the Snowflake class with worker ID and datacenter ID.
2. Generate a snowflake ID using the `generate()` method.
3. Parse the generated snowflake ID using the `parseSnowflake()` method to extract its components.
4. Optionally, check the validity of a snowflake ID using the `isValidSnowflake()` method.

### Example

```javascript
const snowflake = new Snowflake(1, 1);
const id = snowflake.generate();
const parsedId = snowflake.parseSnowflake(id);
const isValid = snowflake.isValidSnowflake(id);
