-- Supabase SQL Editor で実行するマイグレーション

-- 1. テーブル作成
CREATE TABLE children (
  id text PRIMARY KEY,
  name text NOT NULL,
  birthday timestamptz NOT NULL,
  emoji text NOT NULL,
  color text NOT NULL
);

CREATE TABLE artworks (
  id text PRIMARY KEY,
  child_id text NOT NULL REFERENCES children(id),
  title text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  thumbnail_url text NOT NULL,
  location text NOT NULL,
  date timestamptz NOT NULL,
  memo text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. RLS（誰でも読み書き可能 — 家族用アプリ）
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_children" ON children FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_artworks" ON artworks FOR ALL USING (true) WITH CHECK (true);

-- 3. Storage バケット作成（SQL Editor では実行不可。Dashboard > Storage で作成）
-- バケット名: artworks
-- Public: ON
