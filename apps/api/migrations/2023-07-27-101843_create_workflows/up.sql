CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE workflows (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	name TEXT NOT NULL,
	slug TEXT NOT NULL,
	description TEXT,
	default_workflow_state_id UUID NOT NULL,
	internal BOOLEAN NOT NULL DEFAULT FALSE,
	removable BOOLEAN NOT NULL DEFAULT TRUE,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	deleted BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
