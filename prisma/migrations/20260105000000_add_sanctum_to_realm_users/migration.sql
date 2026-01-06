-- Update existing roles
UPDATE realms_users SET user_role = 'GUEST' WHERE user_role = 'OBSERVER';
UPDATE realms_users SET user_role = 'SANCTUM' WHERE user_role = 'CONTRIBUTOR';

-- Add new columns
ALTER TABLE realms_users
  ADD COLUMN sanctum_tier VARCHAR(255),
  ADD COLUMN stripe_subscription_id VARCHAR(255),
  ADD COLUMN stripe_subscription_status VARCHAR(50);

-- Add indexes
CREATE INDEX `idx_realmuser_stripe-subscription-id` ON realms_users(stripe_subscription_id);
CREATE INDEX `idx_realmuser-stripe-subscription-status` ON realms_users(subscription_status);
