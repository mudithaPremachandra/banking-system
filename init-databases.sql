-- =============================================================================
-- PostgreSQL Initialization Script
-- =============================================================================
-- OWNER: Kasunara (Database Administrator)
--
-- PURPOSE: This script runs once when the PostgreSQL container starts for the
-- first time. It creates the three separate databases required by the
-- microservices architecture (one database per service).
--
-- HOW IT WORKS: This file is mounted into the PostgreSQL container at
-- /docker-entrypoint-initdb.d/init-databases.sql. PostgreSQL automatically
-- executes all .sql files in that directory on first startup.
--
-- TODO (Kasunara):
-- 1. Review these database names match the DATABASE_URL env vars in .env
-- 2. Consider adding separate database users per service for better isolation
--    (e.g., auth_user can only access auth_db). For now, all services use the
--    shared postgres superuser — acceptable for development, not for production.
-- 3. If you need extensions (e.g., uuid-ossp), add CREATE EXTENSION statements
--    per database below.
-- =============================================================================

-- Create the three databases (the default 'postgres' database already exists)
CREATE DATABASE auth_db;
CREATE DATABASE account_db;
CREATE DATABASE notification_db;
