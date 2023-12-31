CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sites_users (
	user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	site_id UUID NOT NULL REFERENCES sites (id) ON DELETE CASCADE,
	PRIMARY KEY (site_id, user_id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX sites_users_user_id_idx ON sites_users (user_id);
CREATE INDEX sites_users_site_id_idx ON sites_users (site_id);
