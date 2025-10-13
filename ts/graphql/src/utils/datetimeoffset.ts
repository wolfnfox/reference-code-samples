import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import { DateTime } from 'luxon';

const DateTimeOffset = new GraphQLScalarType({
  name: 'DateTimeOffset',
  description:
    'An ISO-8601 encoded string with an offset from UTC.  Example: `2025-04-05T14:30:00+02:00` or `2025-04-05T12:30:00Z`.',
  serialize(value: unknown): string {
    if (!(value instanceof DateTime)) {
      throw new TypeError(`Value is not an instance of DateTime: ${typeof value}`);
    }
    return (value as DateTime).toISO();
  },
  parseValue(value: string): DateTime {
    const datetime = DateTime.fromISO(value);
    if (!datetime.isValid) {
      throw new TypeError(`Value is not a valid ISO-8601 DateTime: ${value}`);
    }
    return datetime;
  },
  parseLiteral(ast: ValueNode): DateTime {
    if (ast.kind === Kind.STRING) {
      const datetime = DateTime.fromISO(ast.value);
      if (!datetime.isValid) {
        throw new TypeError(`Value is not a valid ISO-8601 DateTime: ${ast.value}`);
      }
      return datetime;
    }
    throw new TypeError(`Value is not a valid string value: ${ast.kind}`);
  },
});

export default DateTimeOffset;
