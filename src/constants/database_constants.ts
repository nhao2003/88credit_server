
//Enum data type orm postgres
export enum PostgresDataType {
    varchar = 'varchar',
    integer = 'integer',
    boolean = 'boolean',
    timestamp_without_timezone = 'timestamp without time zone',
    uuid = 'uuid',
    jsonb = 'jsonb',
    text = 'text',
    date = 'date',
    double_precision = 'double precision',
    bigint = 'bigint',
    point = 'point',
}

export const  DatabaseDefaultValues = {
    now: 'CURRENT_TIMESTAMP',
    true: 'true',
    false: 'false'
}