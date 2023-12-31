CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE iam_conditions (
	key TEXT PRIMARY KEY NOT NULL,
	description TEXT,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	deprecated BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
