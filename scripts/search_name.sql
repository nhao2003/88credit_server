ALTER Table users ADD COLUMN ts_full_name tsvector;

UPDATE users
SET
    ts_full_name = (
        to_tsvector(
            'simple',
            unaccent(first_name)
        ) || to_tsvector('simple', unaccent(last_name))
    );

CREATE INDEX ts_full_name_idx ON users USING GIN (ts_full_name);

CREATE OR REPLACE FUNCTION USER_FULL_NAME_TRIGGER() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_full_name :=
        to_tsvector('simple', unaccent(NEW.first_name)) ||
        to_tsvector('simple', unaccent(NEW.last_name));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ts_full_name_trigger BEFORE INSERT OR UPDATE
ON users FOR EACH ROW EXECUTE PROCEDURE USER_FULL_NAME_TRIGGER();


-- Example
SELECT * FROM users WHERE ts_full_name @@ to_tsquery('simple', unaccent('thuê | nhà | thủ | đức'))
ORDER BY ts_rank_cd(ts_full_name, to_tsquery('simple', unaccent('thuê | nhà | thủ | đức'))) DESC;