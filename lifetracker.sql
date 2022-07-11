\echo "Delete and recreate lifetracker-api db?"
\prompt "return for yes or control-C to cancel > " answer

DROP DATABASE lifetracker;
CREATE DATABASE lifetracker;
\connect lifetracker;

\i lifetracker-schema.sql