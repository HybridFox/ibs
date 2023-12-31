CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE content_type_kinds AS ENUM('CONTENT', 'PAGE', 'CONTENT_BLOCK');

CREATE TABLE content_types (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	description TEXT,
	kind content_type_kinds NOT NULL,
	workflow_id UUID NOT NULL,
	slug TEXT NOT NULL,
	deleted BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
