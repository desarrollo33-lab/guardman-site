-- =============================================
-- GUARDMAN Chile - D1 Database Schema
-- Created: 2026-04-13
-- =============================================

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    hero_heading TEXT,
    meta_title TEXT,
    meta_description TEXT,
    price_range TEXT,
    features TEXT,
    process TEXT,
    common_issues TEXT,
    faqs TEXT,
    image TEXT,
    featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    sort INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    zone TEXT,
    description TEXT,
    neighborhoods TEXT,
    landmarks TEXT,
    priority_score INTEGER DEFAULT 0,
    latitude REAL,
    longitude REAL,
    meta_title TEXT,
    meta_description TEXT,
    image TEXT,
    stats TEXT,
    faqs TEXT,
    featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    sort INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    challenges TEXT,
    meta_title TEXT,
    meta_description TEXT,
    image TEXT,
    featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    sort INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    services TEXT,
    logo_url TEXT,
    featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    sort INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY,
    site_name TEXT DEFAULT 'GuardMan Chile',
    phone TEXT DEFAULT '+56 9 300 000 10',
    email TEXT DEFAULT 'info@guardman.cl',
    address TEXT,
    stats_guards TEXT DEFAULT '500+',
    stats_clients TEXT DEFAULT '200+',
    stats_locations TEXT DEFAULT '14',
    stats_years TEXT DEFAULT '8+',
    updated_at TEXT DEFAULT (datetime('now'))
);
