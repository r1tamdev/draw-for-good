ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS selected_charity_id uuid
REFERENCES charities(id)
ON DELETE SET NULL;

ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_onboarding_contribution_pct_check;

ALTER TABLE profiles
DROP COLUMN IF EXISTS onboarding_contribution_pct;

ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean
NOT NULL
DEFAULT false;

ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_charity_contribution_pct_check;

ALTER TABLE subscriptions
DROP COLUMN IF EXISTS charity_contribution_pct;

WITH duplicate_published_draws AS (
    SELECT
        id,
        ROW_NUMBER() OVER (
            PARTITION BY draw_month
            ORDER BY created_at DESC NULLS LAST, id DESC
        ) AS row_number
    FROM draws
    WHERE status = 'published'
)
UPDATE draws
SET status = 'draft'
WHERE id IN (
    SELECT id
    FROM duplicate_published_draws
    WHERE row_number > 1
);

DROP INDEX IF EXISTS one_published_draw_per_month;

CREATE UNIQUE INDEX one_published_draw_per_month
ON draws(draw_month)
WHERE status = 'published';

INSERT INTO storage.buckets (
    id,
    name,
    public
)
VALUES (
    'winner-proofs',
    'winner-proofs',
    true
)
ON CONFLICT (id)
DO UPDATE SET public = true;

DROP POLICY IF EXISTS
"Authenticated users upload winner proof"
ON storage.objects;

CREATE POLICY
"Authenticated users upload winner proof"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'winner-proofs'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS
"Authenticated users read winner proof"
ON storage.objects;

CREATE POLICY
"Authenticated users read winner proof"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'winner-proofs'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
);

DROP POLICY IF EXISTS
"Authenticated users update winner proof"
ON storage.objects;

CREATE POLICY
"Authenticated users update winner proof"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'winner-proofs'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
)
WITH CHECK (
    bucket_id = 'winner-proofs'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
);

DROP POLICY IF EXISTS
"Authenticated users delete winner proof"
ON storage.objects;

CREATE POLICY
"Authenticated users delete winner proof"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'winner-proofs'
    AND (
        (storage.foldername(name))[1] = auth.uid()::text
        OR
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
);

CREATE INDEX IF NOT EXISTS
idx_profiles_selected_charity
ON profiles(selected_charity_id);

CREATE INDEX IF NOT EXISTS
idx_subscriptions_user_id
ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS
idx_subscriptions_status
ON subscriptions(status);

CREATE INDEX IF NOT EXISTS
idx_scores_user_date
ON scores(user_id, score_date DESC);

CREATE INDEX IF NOT EXISTS
idx_draws_month
ON draws(draw_month);

CREATE INDEX IF NOT EXISTS
idx_winners_user
ON winners(user_id);

CREATE INDEX IF NOT EXISTS
idx_winners_payment_status
ON winners(payment_status);